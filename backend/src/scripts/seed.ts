
import 'dotenv/config';
import { connectMongo } from "../lib/mongo";
import { Movement } from "../models/movement";

type Tipo = "entrada" | "salida";

const YEAR = Number(process.env.SEED_YEAR) || new Date().getFullYear();
const USER_TIMEZONE = process.env.TZ || "America/Argentina/Buenos_Aires";

// Configuración de categorías y rangos típicos
const categoriasSalida = {
  "alquiler": [180000, 260000],
  "supermercado": [15000, 60000],
  "comida_fuera": [5000, 20000],
  "transporte": [1500, 8000],
  "servicios": [20000, 70000], // luz/agua/gas/internet/celular
  "salud": [8000, 40000],
  "ocio": [5000, 40000],
  "hogar": [8000, 60000],
  "educacion": [10000, 50000]
} as const;

const categoriasEntrada = {
  "sueldo": [600000, 1200000],
  "freelance": [80000, 300000],
  "reembolso": [10000, 100000],
  "otros": [5000, 150000]
} as const;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function choice<T>(arr: T[]): T { return arr[randInt(0, arr.length - 1)]; }

function amountForRange([min, max]: readonly [number, number]) {
  // redondeo a 2 decimales
  return Math.round(rand(min, max) * 100) / 100;
}

function randomDateInMonth(year: number, monthIndex0: number): Date {
  // monthIndex0: 0..11
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
  const day = randInt(1, daysInMonth);
  // Evita horas dispersas: setear al mediodía local
  const d = new Date(Date.UTC(year, monthIndex0, day, 15, 0, 0)); // 12:00 ART ~ 15 UTC
  return d;
}

async function seedYear(year: number) {
  console.log(`Seeding movimientos para el año ${year}…`);

  // Opcional: limpiar movimientos de ese año para evitar duplicados
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const end   = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));
  const existing = await Movement.countDocuments({ date: { $gte: start, $lt: end } });
  if (existing > 0) {
    console.log(`Eliminando ${existing} movimientos existentes del año ${year}…`);
    await Movement.deleteMany({ date: { $gte: start, $lt: end } });
  }

  const docs: any[] = [];

  for (let month = 0; month < 12; month++) {
    // Entradas fijas: sueldo entre el 1 y el 7 de cada mes
    const sueldoFecha = new Date(Date.UTC(year, month, randInt(1, 7), 15, 0, 0));
    docs.push({
      type: "entrada",
      amount: amountForRange(categoriasEntrada["sueldo"]),
      date: sueldoFecha,
      category: "sueldo",
      note: `Sueldo ${year}-${String(month + 1).padStart(2, "0")}`
    });

    // Opcional: 0-2 trabajos freelance por mes
    const freelances = randInt(0, 2);
    for (let i = 0; i < freelances; i++) {
      const fDate = randomDateInMonth(year, month);
      docs.push({
        type: "entrada",
        amount: amountForRange(categoriasEntrada["freelance"]),
        date: fDate,
        category: "freelance",
        note: "Trabajo freelance"
      });
    }

    // Gastos fijos: alquiler el día 1-10, servicios (3-5 por mes), transporte (8-20), supermercado (4-8), etc.
    const alquilerFecha = new Date(Date.UTC(year, month, randInt(1, 10), 15, 0, 0));
    docs.push({
      type: "salida",
      amount: amountForRange(categoriasSalida["alquiler"]),
      date: alquilerFecha,
      category: "alquiler",
      note: "Alquiler"
    });

    const serviciosCant = randInt(3, 5);
    for (let i = 0; i < serviciosCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["servicios"]),
        date: randomDateInMonth(year, month),
        category: "servicios",
        note: "Pago de servicios"
      });
    }

    const superCant = randInt(4, 8);
    for (let i = 0; i < superCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["supermercado"]),
        date: randomDateInMonth(year, month),
        category: "supermercado",
        note: "Compras supermercado"
      });
    }

    const comidaFuera = randInt(2, 6);
    for (let i = 0; i < comidaFuera; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["comida_fuera"]),
        date: randomDateInMonth(year, month),
        category: "comida_fuera",
        note: "Comida fuera de casa"
      });
    }

    const transporteCant = randInt(8, 20);
    for (let i = 0; i < transporteCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["transporte"]),
        date: randomDateInMonth(year, month),
        category: "transporte",
        note: "Transporte"
      });
    }

    const ocioCant = randInt(2, 6);
    for (let i = 0; i < ocioCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["ocio"]),
        date: randomDateInMonth(year, month),
        category: "ocio",
        note: "Ocio"
      });
    }

    const hogarCant = randInt(1, 3);
    for (let i = 0; i < hogarCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["hogar"]),
        date: randomDateInMonth(year, month),
        category: "hogar",
        note: "Gastos hogar"
      });
    }

    const eduCant = randInt(0, 2);
    for (let i = 0; i < eduCant; i++) {
      docs.push({
        type: "salida",
        amount: amountForRange(categoriasSalida["educacion"]),
        date: randomDateInMonth(year, month),
        category: "educacion",
        note: "Educación / cursos"
      });
    }
  }

  console.log(`Insertando ${docs.length} movimientos…`);
  await Movement.insertMany(docs);
  console.log("Listo ✅");
}

async function main() {
  const uri = process.env.MONGO_URI || "";
  if (!uri) {
    console.error("Falta MONGO_URI en .env");
    process.exit(1);
  }
  await connectMongo(uri);
  await seedYear(YEAR);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
