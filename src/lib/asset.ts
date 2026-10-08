// Префиксует путь к статическому файлу базовым путём сборки (Vite `base`),
// чтобы абсолютные пути вида "assets/img/x.jpg" работали и при деплое
// из корня домена, и из подпути вроде /dev34-react/.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
