const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const gallery = require('../project-gallery-model.js');

const projects = [
  { id: 1, nama_proyek: 'Site One', kategori_id: 'Website' },
  { id: 2, nama_proyek: 'App One', kategori_id: 'Mobile App' },
  { id: 3, nama_proyek: 'Dashboard', kategori_id: 'UI Design' },
  { id: 4, nama_proyek: 'Poster', kategori_id: 'Graphic Design' },
  { id: 5, nama_proyek: 'Short Film', kategori_id: 'Video' },
  { id: 6, nama_proyek: 'Nature Study', kategori_id: 'Photography' },
  { id: 7, nama_proyek: 'Website Two', kategori_id: 'Website', deskripsi_singkat: 'Design portfolio' }
];

test('exposes the six requested project categories', () => {
  assert.deepEqual(gallery.categories.map(({ label }) => label), [
    'All Projects', 'Website', 'Mobile App', 'Design', 'Video', 'Photography'
  ]);
});

test('maps legacy UI and graphic design values into Design without changing records', () => {
  assert.equal(gallery.categoryFor(projects[2]), 'Design');
  assert.equal(gallery.categoryFor(projects[3]), 'Design');
  assert.equal(projects[2].kategori_id, 'UI Design');
});

test('combines category filtering with name search only', () => {
  assert.deepEqual(gallery.filterProjects(projects, 'Design', 'poster').map(item => item.id), [4]);
  assert.deepEqual(gallery.filterProjects(projects, 'Website', 'design'), []);
  assert.deepEqual(gallery.filterProjects(projects, 'Website', 'website').map(item => item.id), [7]);
});

test('paginates six projects at a time and clamps out-of-range pages', () => {
  const first = gallery.paginateProjects(projects, 1);
  const second = gallery.paginateProjects(projects, 2);
  assert.equal(first.items.length, 6);
  assert.equal(first.totalPages, 2);
  assert.deepEqual(second.items.map(item => item.id), [7]);
  assert.equal(gallery.paginateProjects(projects, 10).page, 2);
  assert.equal(gallery.paginateProjects([], 1).totalPages, 1);
  assert.deepEqual(gallery.visiblePages(10, 1), [1, 2, 3, 4, 5]);
  assert.deepEqual(gallery.visiblePages(10, 8), [6, 7, 8, 9, 10]);
});

test('project cards link to slug details and the site rewrites those routes', () => {
  const projectsPage = fs.readFileSync(require.resolve('../projects.js'), 'utf8');
  const routes = JSON.parse(fs.readFileSync(require.resolve('../vercel.json'), 'utf8'));
  assert.match(projectsPage, /href="\/projects\/\$\{encodeURIComponent\(media\.projectSlug\(project\)\)\}"/);
  assert.ok(routes.rewrites.some(route => route.source === '/projects/:slug' && route.destination === '/projects.html?slug=:slug'));
});
