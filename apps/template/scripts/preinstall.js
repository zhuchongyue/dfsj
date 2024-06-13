
if (!process.env.npm_execpath || !process.env.npm_execpath.includes('pnpm')) {
    console.warn(
        `\u001b[33mThis repository must using pnpm as the package manager ` +
        ` for scripts to work properly.\u001b[39m\n`,
    )
    process.exit(1)
}
