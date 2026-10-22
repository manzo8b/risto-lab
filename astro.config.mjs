import {defineConfig} from 'astro/config';
export default defineConfig({site:'https://manzo8b.github.io',base:'/risto-lab',trailingSlash:'always',output:'static',srcDir:'./src/instructor',outDir:'./dist',publicDir:'./public',devToolbar:{enabled:false},server:{host:'127.0.0.1',port:4322}});
