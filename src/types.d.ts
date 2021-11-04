type Command = {
    name: string
    handler: <unknown>() => Promise<unknown> | unknown
}

type Link = {
    name: string
    url: string | URL
}
