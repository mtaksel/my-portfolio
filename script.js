"use strict";

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const links = [...document.querySelectorAll(".nav-links a")];
function updateNavigation() {
    const hash = window.location.hash || "#home";
    for (const link of links) {
        if (link.getAttribute("href") === hash) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    }
}
window.addEventListener("hashchange", updateNavigation);
updateNavigation();

const documents = Object.freeze({
    cv: { title: "Unlock CV", file: "Mehmet-Turgut-Aksel-CV.pdf" },
    "cover-letter": { title: "Unlock cover letter", file: "Mehmet-Turgut-Aksel-Cover-Letter.pdf" }
});
const downloadDialog = document.getElementById("download-dialog");
const downloadForm = document.getElementById("download-form");
const passwordInput = document.getElementById("document-password");
const downloadStatus = document.getElementById("download-status");
const downloadSubmit = document.getElementById("download-submit");
let selectedDocument = null;
let requestVersion = 0;
let downloadController = null;

function decodeBase64(value) {
    return Uint8Array.from(atob(value), char => char.charCodeAt(0));
}

async function decryptDocument(payload, password) {
    if (payload.version !== 1 || payload.algorithm !== "AES-GCM" ||
        payload.kdf !== "PBKDF2" || payload.hash !== "SHA-256" ||
        payload.iterations !== 310000) {
        throw new Error("This document format is not supported.");
    }
    const salt = decodeBase64(payload.salt);
    const iv = decodeBase64(payload.iv);
    if (salt.length !== 16 || iv.length !== 12) throw new Error("The document is invalid.");
    const passwordBytes = new TextEncoder().encode(password);
    const material = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveKey"]);
    passwordBytes.fill(0);
    const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: payload.iterations, hash: "SHA-256" },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );
    return crypto.subtle.decrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, decodeBase64(payload.ciphertext));
}

document.querySelectorAll("[data-document]").forEach(button => {
    button.addEventListener("click", () => {
        selectedDocument = documents[button.dataset.document];
        if (!selectedDocument) return;
        requestVersion++;
        downloadForm.reset();
        downloadStatus.textContent = "";
        downloadStatus.removeAttribute("data-error");
        passwordInput.removeAttribute("aria-invalid");
        downloadSubmit.disabled = false;
        document.getElementById("download-title").textContent = selectedDocument.title;
        downloadDialog.showModal();
    });
});

document.getElementById("download-cancel").addEventListener("click", () => downloadDialog.close());
downloadDialog.addEventListener("close", () => {
    requestVersion++;
    downloadController?.abort();
    selectedDocument = null;
    downloadForm.reset();
    downloadStatus.textContent = "";
    passwordInput.removeAttribute("aria-invalid");
    downloadSubmit.disabled = false;
});

downloadForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!selectedDocument || downloadSubmit.disabled) return;
    if (!globalThis.crypto?.subtle) {
        downloadStatus.textContent = "Open this site over HTTPS or localhost to unlock documents.";
        downloadStatus.dataset.error = "true";
        return;
    }
    const documentToDownload = selectedDocument;
    const currentRequest = ++requestVersion;
    const password = passwordInput.value;
    passwordInput.value = "";
    passwordInput.removeAttribute("aria-invalid");
    downloadStatus.removeAttribute("data-error");
    downloadStatus.textContent = "Unlocking document…";
    downloadSubmit.disabled = true;
    downloadController = new AbortController();

    try {
        const response = await fetch(
            new URL("assets/files/" + documentToDownload.file + ".enc", document.baseURI),
            { signal: downloadController.signal, cache: "no-store" }
        );
        if (!response.ok) throw new Error("The document could not be loaded. Please try again.");
        const payload = await response.json();
        const pdf = await decryptDocument(payload, password);
        if (currentRequest !== requestVersion || !downloadDialog.open) return;
        const blob = new Blob([pdf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = documentToDownload.file;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        downloadDialog.close();
    } catch (error) {
        if (currentRequest !== requestVersion || error.name === "AbortError") return;
        downloadStatus.dataset.error = "true";
        if (error.name === "OperationError") {
            downloadStatus.textContent = "Incorrect password. Please try again.";
            passwordInput.setAttribute("aria-invalid", "true");
        } else {
            downloadStatus.textContent = "The document could not be unlocked. Please try again.";
        }
        passwordInput.focus();
    } finally {
        if (currentRequest === requestVersion) downloadSubmit.disabled = false;
    }
});
