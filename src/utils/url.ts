export function getURL(base: 'base' | 'admin' | 'api', uri: string): string{
    switch(base){
        case 'admin': {
            return `${process.env.URL}${process.env.URL_ADMIN}/${uri}`;
        }
        case 'api': {
            return `${process.env.URL}${process.env.URL_API}/${uri}`;
        }
        case 'base':
        default: {
            return `${process.env.URL}/${uri}`;
        }
    }
}