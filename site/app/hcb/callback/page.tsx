export default async function Page({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}){
    const code = (await searchParams).code
    return (
        <div className = "m-10">
            <p>wow! { !code && "why are you here lol" }</p>
            { code && <code>{code}</code>}
        </div>
    )
}