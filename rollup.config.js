import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取 packages 目录下的所有子目录
const packagesDir = path.resolve(__dirname, 'packages');
const packageDirs = fs.readdirSync(packagesDir).filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

const configs = packageDirs.map(dir => ({
    input: path.resolve(packagesDir, dir, 'src/index.ts'),
    output: {
        file: path.resolve(packagesDir, dir, 'dist/index.js'),
        format: 'cjs', // 输出格式，可选 'es', 'umd', 'iife' 等
        name: 'web-saw',
        sourcemap: true // 生成 sourcemap
    },
    plugins: [
        resolve(), // 使 Rollup 能够解析 node_modules 中的模块
        commonjs(), // 转换 CommonJS 模块为 ES6
        json(), // 使 Rollup 能够导入 JSON 文件
        typescript() // 处理 TypeScript 文件
    ]
}));

export default configs;
