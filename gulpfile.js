const gulp = require("gulp");
const plumber = require("gulp-plumber");

gulp.srcPlumber = function (...args) {
	return gulp.src(...args)
		.pipe(plumber());
}

const moduleCache = {};
function requireCache(moduleName) {
	if (!(moduleName in moduleCache)) {
		moduleCache[moduleName] = require(moduleName);
	}
	return moduleCache[moduleName];
}

let project;
gulp.task("ts", () => {
	const typescript = requireCache("gulp-typescript");
	const merge = requireCache("merge2");
	if (!project) project = typescript.createProject("tsconfig.json");
	const result = project.src()
		.pipe(plumber())
		.pipe(project());

	return merge([
		result.js.pipe(gulp.dest("out/script")),
		result.dts.pipe(gulp.dest("out/script")),
	]);
});

gulp.task("scss", cb => {
	const sass = requireCache("gulp-sass");
	gulp.srcPlumber("./style/index.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("out/style"))
		.on("finish", cb);
});

gulp.task("mocha", () => {
	const mocha = requireCache("gulp-mocha");
	gulp.src("out/tests/Main.js", { read: false })
		.pipe(mocha({ reporter: "min" }))
		.on("error", () => process.exitCode = 1);
});

gulp.task("compile-test", () => {
	const runSequence = requireCache("run-sequence");
	runSequence("ts", "mocha");
});

gulp.task("connect", function () {
	const connect = requireCache("gulp-connect");
	connect.server({
		port: 8082
	});
});

gulp.task("watch", ["connect", "compile-test", "scss"], () => {
	gulp.watch("./src/**/*.ts", ["compile-test"]);
	gulp.watch("./style/**/*.scss", ["scss"]);
});

gulp.task("default", ["watch"])