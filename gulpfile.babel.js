/**********************************************************************************/
/*                                                                                */
/*                                   LIBRARIES                                    */
/*                                                                                */
/**********************************************************************************/

import ts from "gulp-typescript";
import del from "del";
import gulp from "gulp";
import debug from "gulp-debug";
import yargs from "yargs";
import mkdirp from "mkdirp";
import rename from "gulp-rename";
import gulpMocha from "gulp-mocha";
import gulpTsLint from "gulp-tslint";
import sourcemaps from "gulp-sourcemaps";
import * as tslint from "tslint";
import gulpIstanbul from "gulp-istanbul";
import elegantStatus from "elegant-status";

/**********************************************************************************/
/*                                                                                */
/*                                     SETUP                                      */
/*                                                                                */
/**********************************************************************************/

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = yargs.argv.env || "dev";
}

const tsProject = ts.createProject(
    "tsconfig.json",
    process.env.NODE_ENV === "test" ? {} : { noUnusedLocals: true, noUnusedParameters: true }
);

/**********************************************************************************/
/*                                                                                */
/*                                    HELPERS                                     */
/*                                                                                */
/**********************************************************************************/

const removeDirectory = directory => {
    const done = elegantStatus(`Removing [${directory}] directory...`);
    return del(directory)
        .then(() => {
            done.updateText(`[${directory}] directory removed`);
            done(true);
        })
        .catch(error => {
            done.updateText(`ERROR: Cannot remove [${directory}] directory: ${error.message}`);
            done(false);
        });
};

const tsc = (sources, directory) => {
    const done = elegantStatus("Transpiling sources...");
    const stream = gulp.src(sources);

    stream.on("end", () => {
        done.updateText(`All sources have been properly transpiled to [${directory}] directory`);
        done(true);
    });

    stream.on("error", error => {
        done.updateText(`ERROR: Cannot transpile sources: ${error.message}`);
        done(false);
    });

    return stream
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(
            sourcemaps.write(".", {
                sourceRoot: file => `${file.cwd}/${directory}`
            })
        )
        .pipe(gulp.dest(directory));
};

const copyFiles = (sources, directory) => {
    const done = elegantStatus("Copying files...");
    const stream = gulp.src(sources);

    stream.on("end", () => {
        done.updateText(`All files copied to [${directory}] directory`);
        done(true);
    });

    stream.on("error", error => {
        done.updateText(`ERROR: Cannot copy files: ${error.message}`);
        done(false);
    });

    return stream.pipe(gulp.dest(directory));
};

/**********************************************************************************/
/*                                                                                */
/*                                     HOOKS                                      */
/*                                                                                */
/**********************************************************************************/

const cleanTmp = () => removeDirectory("tmp");
const cleanDist = () => removeDirectory("dist");

const transpile = () => tsc(["tmp/**/*.ts"], "dist");

const copyTestFiles = () => copyFiles(["src/**/*.spec.ts"], "tmp");
const copySourceFiles = () => copyFiles(["src/**/*.ts", "!src/**/*.spec.ts", "!src/environments/**/*"], "tmp");

const mkdir = finished => {
    const done = elegantStatus("Creating `log` directory...");
    mkdirp.sync("logs");
    done.updateText("`log` directory created");
    done(true);
    return finished();
};

const lint = emitError => {
    return () => {
        const done = elegantStatus("Linting sources...");
        const program = tslint.Linter.createProgram("tsconfig.json");
        const stream = gulpTsLint.report({ emitError });

        stream.on("end", () => {
            done.updateText(`Linting OK`);
            done(true);
        });

        stream.on("error", () => {
            done.updateText(`ERROR: Linting KO`);
            done(false);
        });

        return gulp
            .src(["src/**/*.ts", "!src/**/*.spec.ts"])
            .pipe(debug({ title: "-- Linting:" }))
            .pipe(gulpTsLint({ program, formatter: "stylish" }))
            .pipe(stream);
    };
};

const istanbul = () => {
    return gulp
        .src(["src/**/*.js"])
        .pipe(gulpIstanbul())
        .pipe(gulpIstanbul.hookRequire());
};

const mocha = () => {
    return gulp
        .src(["node_modules/reflect-metadata/Reflect.js", "dist/**/*.spec.js"])
        .pipe(gulpMocha({ ui: "bdd" }))
        .pipe(gulpIstanbul.writeReports());
};

/**********************************************************************************/
/*                                                                                */
/*                                     TASKS                                      */
/*                                                                                */
/**********************************************************************************/

gulp.task("lint", lint(true));
gulp.task("clean", gulp.series(cleanTmp, cleanDist));
gulp.task("transpile", transpile);
gulp.task("copy-test-files", copyTestFiles);
gulp.task("copy-source-files", copySourceFiles);

gulp.task("build", gulp.series("clean", "copy-source-files", "transpile", cleanTmp));
gulp.task("build-test", gulp.series("clean", "copy-source-files", "copy-test-files", "transpile", cleanTmp));
gulp.task("test", gulp.series("build-test", istanbul, mocha));

gulp.task("default", gulp.series("test"));
