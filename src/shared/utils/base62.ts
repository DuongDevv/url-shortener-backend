const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const encodeBase62  = (num: number | bigint): string => {
    if(num===0 || num===0n) return BASE62_CHARSET[0];

    let n = BigInt(num);
    const base = BigInt(BASE62_CHARSET.length); //62
    let result = '';

    while(n > 0) {
        const remainder = Number(n % base);
        result = BASE62_CHARSET[remainder] + result;
        n/=base;
    }

    return result;
}