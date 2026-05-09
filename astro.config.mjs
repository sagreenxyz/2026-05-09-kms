// @ts-check
import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY || '';
const [owner = '', repo = ''] = repository.split('/');
const isUserOrOrgPagesRepo = owner && repo && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE || (owner ? `https://${owner}.github.io` : 'http://localhost:4321'),
	base: process.env.BASE || (repo && !isUserOrOrgPagesRepo ? `/${repo}` : '/'),
});
