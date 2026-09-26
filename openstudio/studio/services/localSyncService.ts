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
    },

    /**
     * Pull all files from the local directory into a virtual file tree.
     */
    async pullFromLocal(): Promise<FileNode[]> {
        if (!this.directoryHandle) {
            console.warn("No local folder linked.");
            return [];
        }

        const fileTree: FileNode[] = [];

        try {
            // Verify permission
            // @ts-ignore
            const permission = await this.directoryHandle.queryPermission({ mode: 'readwrite' });
            if (permission !== 'granted') {
                // @ts-ignore
                const request = await this.directoryHandle.requestPermission({ mode: 'readwrite' });
                if (request !== 'granted') return [];
            }

            // Recursive function to traverse directory
            async function traverse(dirHandle: any, currentPath: string) {
                // @ts-ignore
                for await (const entry of dirHandle.values()) {
                    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next' || entry.name === 'dist') {
                        continue;
                    }
                    
                    const fullPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
                    
                    if (entry.kind === 'file') {
                        const file = await entry.getFile();
                        // Ignore binary/large files based on heuristics or mime type
                        if (file.size > 1024 * 1024) continue; // Skip files > 1MB
                        const content = await file.text();
                        fileTree.push({ path: fullPath, content: content });
                    } else if (entry.kind === 'directory') {
                        await traverse(entry, fullPath);
                    }
                }
            }

            await traverse(this.directoryHandle, '');
            return fileTree;
        } catch (e) {
            console.error("Failed to pull from local folder:", e);
            return [];
        }
    }
};
