import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import mahasiswaRouter from "./mahasiswa";
import dosenRouter from "./dosen";
import mataKuliahRouter from "./mata-kuliah";
import jadwalRouter from "./jadwal";
import krsRouter from "./krs";
import nilaiRouter from "./nilai";
import absensiRouter from "./absensi";
import diskusiRouter from "./diskusi";
import statsRouter from "./stats";
import publicRouter from "./public";
import uploadRouter from "./upload";
import galleryRouter from "./gallery";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(mahasiswaRouter);
router.use(dosenRouter);
router.use(mataKuliahRouter);
router.use(jadwalRouter);
router.use(krsRouter);
router.use(nilaiRouter);
router.use(absensiRouter);
router.use(diskusiRouter);
router.use(statsRouter);
router.use(uploadRouter);
router.use(galleryRouter);
router.use(publicRouter);

export default router;
