/// <reference types="vite/client" />


interface ImportMetaEnv {
	VITE_MAGIC_API_KEY: string
	VITE_BLOCKCHAIN_NETWORK: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

