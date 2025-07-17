import 'server-only'; 
import fs from 'fs';
import path from 'path';

export const fetchData = async (file: string) => {
    try {
        // const res = await fetch(`http://bdcdev.in/work/bombaydc.com/revamp-static/data/${file}`);
        //         if (!res.ok) throw new Error(`Failed to load ${file}`);
        //         return await res.json();

        const filePath = path.join(process.cwd(), 'public', 'data', file); 

        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error fetching ${file}: `, error);
        return null;
    }
}