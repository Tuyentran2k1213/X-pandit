import * as bcryptjs from 'bcryptjs';

export async function hashingPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(password, salt);   
    return hash;
}

export async function comparePassword(param: string, hash: string): Promise<boolean> {
    const result = await bcryptjs.compareSync(param, hash);
    return result;
}