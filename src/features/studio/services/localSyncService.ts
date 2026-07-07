/**
 * Service to sync OpenStudio virtual files with a local physical folder 
 * using the modern Browser File System Access API.
 */

import { FileNode } from "../types";

export const LocalSyncService = {
    directoryHandle: null as FileSystemDirectoryHandle | null,

    /**
     * Request access to a local directory
     */
    async linkFolder(): Promise<boolean> {
        try {
            // @ts-ignore
            if (!window.showDirectoryPicker) {
                alert("Your browser does not support the File System Access API. Please use Chrome, Edge, or Opera.");
                return false;
            }

            // @ts-ignore
            this.directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });

            console.log("Linked to local folder:", this.directoryHandle?.name);
            return true;
        } catch (e) {
            console.error("Failed to link local folder:", e);
            return false;
        }
    },

    /**
     * Push the virtual file tree to the local directory
     */
    async syncToLocal(fileTree: FileNode[]): Promise<boolean> {
        if (!this.directoryHandle) {
            console.warn("No local folder linked.");
            return false;
        }

        try {
            // Verify permission
            // @ts-ignore
            const permission = await this.directoryHandle.queryPermission({ mode: 'readwrite' });
            if (permission !== 'granted') {
                // @ts-ignore
                const request = await this.directoryHandle.requestPermission({ mode: 'readwrite' });
                if (request !== 'granted') return false;
            }

            // Write all files
            for (const file of fileTree) {
                // Skip if it's a directory or has no content
                if (file.path.endsWith('/')) continue;

                // Ensure subdirectories exist
                const parts = file.path.split('/');
                const fileName = parts.pop();
                let currentHandle = this.directoryHandle;

                for (const part of parts) {
                    if (!part) continue; // handle leading slashes
                    if (part === '.' || part === '..') continue;
                    // @ts-ignore
                    currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
                }

                if (fileName && file.content !== undefined) {
                    // @ts-ignore
                    const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
                    // @ts-ignore
                    const writable = await fileHandle.createWritable();
                    await writable.write(file.content);
                    await writable.close();
                }
            }

            return true;
        } catch (e) {
            console.error("Failed to sync to local folder:", e);
            return false;
        }
    },
    
    isLinked() {
        return this.directoryHandle !== null;
    },
    
    getLinkedFolderName() {
        return this.directoryHandle?.name || null;
    }
};
