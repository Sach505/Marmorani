/**
 * Prisma Database Seed Script
 *
 * Seeds the database with 10 marble types and their finishes.
 * Idempotent: Running multiple times produces the same result.
 *
 * Usage: npm run db:seed
 *
 * @see Story 2.1: Marble Data Seeding & Constants
 */

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { FinishType } from "../src/generated/prisma/enums";
import type { MarbleSeedData, LocalizedString } from "../src/types/marble";
import { FINISH_PRICE_MODIFIERS } from "../src/constants/marbles";

// Use DIRECT_URL for migrations/seeding (not pooled connection)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================================
// MARBLE DATA DEFINITIONS
// ============================================================================

const MARBLES: MarbleSeedData[] = [
  // 1. Carrara White (Italy)
  {
    slug: "carrara-white",
    name: {
      en: "Carrara White",
      fr: "Carrare Blanc",
      it: "Bianco Carrara",
      es: "Blanco Carrara",
      de: "Carrara Weiß",
    },
    description: {
      en: "Extracted from the Apuan Alps in Tuscany, Carrara marble has been prized since Roman times. Its soft white background with delicate grey veining inspired Michelangelo's David and countless Renaissance masterpieces. Perfect for elegant tabletops and decorative columns.",
      fr: "Extrait des Alpes Apuanes en Toscane, le marbre de Carrare est prisé depuis l'époque romaine. Son fond blanc doux aux veines grises délicates a inspiré le David de Michel-Ange et d'innombrables chefs-d'œuvre de la Renaissance. Parfait pour les plateaux de table élégants et les colonnes décoratives.",
      it: "Estratto dalle Alpi Apuane in Toscana, il marmo di Carrara è apprezzato fin dall'epoca romana. Il suo sfondo bianco morbido con delicate venature grigie ha ispirato il David di Michelangelo e innumerevoli capolavori rinascimentali. Perfetto per eleganti piani tavolo e colonne decorative.",
      es: "Extraído de los Alpes Apuanos en la Toscana, el mármol de Carrara ha sido apreciado desde la época romana. Su fondo blanco suave con delicadas vetas grises inspiró el David de Miguel Ángel e innumerables obras maestras del Renacimiento. Perfecto para elegantes tableros y columnas decorativas.",
      de: "Der aus den Apuanischen Alpen in der Toskana gewonnene Carrara-Marmor wird seit der Römerzeit geschätzt. Sein weicher weißer Hintergrund mit zarten grauen Adern inspirierte Michelangelos David und unzählige Meisterwerke der Renaissance. Perfekt für elegante Tischplatten und dekorative Säulen.",
    },
    density: 2710,
    basePricePerCm3: 8,
    origin: "Italy",
    textureFolder: "carrara-white",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.RAW, priceModifier: FINISH_PRICE_MODIFIERS.RAW },
    ],
  },

  // 2. Nero Marquina (Spain)
  {
    slug: "nero-marquina",
    name: {
      en: "Nero Marquina",
      fr: "Noir Marquina",
      it: "Nero Marquina",
      es: "Negro Marquina",
      de: "Nero Marquina",
    },
    description: {
      en: "From the Basque Country of Spain, Nero Marquina is renowned for its deep black background crossed by striking white calcite veins. This dramatic contrast makes it a favorite for statement pieces and modern interiors. Each block tells a unique geological story.",
      fr: "Originaire du Pays Basque espagnol, le Nero Marquina est réputé pour son fond noir profond traversé par des veines de calcite blanches saisissantes. Ce contraste dramatique en fait un favori pour les pièces maîtresses et les intérieurs modernes. Chaque bloc raconte une histoire géologique unique.",
      it: "Proveniente dai Paesi Baschi spagnoli, il Nero Marquina è rinomato per il suo sfondo nero intenso attraversato da sorprendenti venature di calcite bianca. Questo contrasto drammatico lo rende un favorito per pezzi di design e interni moderni. Ogni blocco racconta una storia geologica unica.",
      es: "Procedente del País Vasco español, el Negro Marquina es famoso por su fondo negro profundo cruzado por llamativas venas de calcita blanca. Este contraste dramático lo convierte en favorito para piezas de diseño e interiores modernos. Cada bloque cuenta una historia geológica única.",
      de: "Aus dem spanischen Baskenland stammend, ist Nero Marquina bekannt für seinen tiefschwarzen Hintergrund, der von auffälligen weißen Calcitadern durchzogen wird. Dieser dramatische Kontrast macht ihn zum Favoriten für Statement-Stücke und moderne Interieurs. Jeder Block erzählt eine einzigartige geologische Geschichte.",
    },
    density: 2700,
    basePricePerCm3: 12,
    origin: "Spain",
    textureFolder: "nero-marquina",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.BRUSHED, priceModifier: FINISH_PRICE_MODIFIERS.BRUSHED },
    ],
  },

  // 3. Calacatta Gold (Italy)
  {
    slug: "calacatta-gold",
    name: {
      en: "Calacatta Gold",
      fr: "Calacatta Or",
      it: "Calacatta Oro",
      es: "Calacatta Oro",
      de: "Calacatta Gold",
    },
    description: {
      en: "The rarest and most prestigious Italian marble, Calacatta Gold features a warm white background with bold golden and grey veining. Quarried in limited quantities from Carrara, it represents the pinnacle of natural stone luxury. Reserved for the most discerning collectors.",
      fr: "Le marbre italien le plus rare et le plus prestigieux, le Calacatta Or présente un fond blanc chaud avec des veines dorées et grises audacieuses. Extrait en quantités limitées à Carrare, il représente le summum du luxe en pierre naturelle. Réservé aux collectionneurs les plus exigeants.",
      it: "Il marmo italiano più raro e prestigioso, il Calacatta Oro presenta uno sfondo bianco caldo con venature dorate e grigie audaci. Estratto in quantità limitate da Carrara, rappresenta l'apice del lusso in pietra naturale. Riservato ai collezionisti più esigenti.",
      es: "El mármol italiano más raro y prestigioso, el Calacatta Oro presenta un fondo blanco cálido con vetas doradas y grises audaces. Extraído en cantidades limitadas de Carrara, representa la cúspide del lujo en piedra natural. Reservado para los coleccionistas más exigentes.",
      de: "Der seltenste und prestigeträchtigste italienische Marmor, Calacatta Gold, zeigt einen warmen weißen Hintergrund mit kühnen goldenen und grauen Adern. In begrenzten Mengen aus Carrara gewonnen, repräsentiert er den Gipfel des Natursteinluxus. Reserviert für die anspruchsvollsten Sammler.",
    },
    density: 2700,
    basePricePerCm3: 18,
    origin: "Italy",
    textureFolder: "calacatta-gold",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
    ],
  },

  // 4. Emperador Dark (Spain)
  {
    slug: "emperador-dark",
    name: {
      en: "Emperador Dark",
      fr: "Empereur Foncé",
      it: "Emperador Scuro",
      es: "Emperador Oscuro",
      de: "Emperador Dunkel",
    },
    description: {
      en: "Quarried in southeastern Spain, Emperador Dark captivates with its rich chocolate brown tones interlaced with lighter veining. This warm, sophisticated marble brings earthy elegance to any space. Its natural variation ensures each piece is one-of-a-kind.",
      fr: "Extrait du sud-est de l'Espagne, l'Empereur Foncé captive par ses riches tons brun chocolat entrelacés de veines plus claires. Ce marbre chaud et sophistiqué apporte une élégance terreuse à tout espace. Sa variation naturelle garantit que chaque pièce est unique.",
      it: "Estratto nel sud-est della Spagna, l'Emperador Scuro affascina con i suoi ricchi toni marrone cioccolato intrecciati con venature più chiare. Questo marmo caldo e sofisticato porta un'eleganza terrosa in ogni spazio. La sua variazione naturale garantisce che ogni pezzo sia unico.",
      es: "Extraído en el sureste de España, el Emperador Oscuro cautiva con sus ricos tonos marrón chocolate entrelazados con vetas más claras. Este mármol cálido y sofisticado aporta una elegancia terrosa a cualquier espacio. Su variación natural asegura que cada pieza sea única.",
      de: "Der im Südosten Spaniens gewonnene Emperador Dunkel fasziniert mit seinen satten schokoladenbraunen Tönen, die mit helleren Adern durchzogen sind. Dieser warme, elegante Marmor bringt erdige Eleganz in jeden Raum. Seine natürliche Variation stellt sicher, dass jedes Stück einzigartig ist.",
    },
    density: 2720,
    basePricePerCm3: 10,
    origin: "Spain",
    textureFolder: "emperador-dark",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.BRUSHED, priceModifier: FINISH_PRICE_MODIFIERS.BRUSHED },
    ],
  },

  // 5. Statuario (Italy)
  {
    slug: "statuario",
    name: {
      en: "Statuario",
      fr: "Statuaire",
      it: "Statuario",
      es: "Statuario",
      de: "Statuario",
    },
    description: {
      en: "Among the most coveted marbles in the world, Statuario comes from select quarries in the Carrara mountains. Its brilliant white background showcases dramatic grey veining that flows like brushstrokes. The stone of choice for sculptors and architects throughout history.",
      fr: "Parmi les marbres les plus convoités au monde, le Statuaire provient de carrières sélectionnées dans les montagnes de Carrare. Son fond blanc brillant met en valeur des veines grises dramatiques qui coulent comme des coups de pinceau. La pierre de choix des sculpteurs et architectes à travers l'histoire.",
      it: "Tra i marmi più ambiti al mondo, lo Statuario proviene da cave selezionate nelle montagne di Carrara. Il suo brillante sfondo bianco mette in risalto venature grigie drammatiche che scorrono come pennellate. La pietra preferita da scultori e architetti nel corso della storia.",
      es: "Entre los mármoles más codiciados del mundo, el Statuario proviene de canteras selectas en las montañas de Carrara. Su brillante fondo blanco muestra dramáticas vetas grises que fluyen como pinceladas. La piedra elegida por escultores y arquitectos a lo largo de la historia.",
      de: "Der Statuario gehört zu den begehrtesten Marmoren der Welt und stammt aus ausgewählten Steinbrüchen in den Bergen von Carrara. Sein brillant weißer Hintergrund zeigt dramatische graue Adern, die wie Pinselstriche fließen. Der Stein der Wahl für Bildhauer und Architekten im Laufe der Geschichte.",
    },
    density: 2690,
    basePricePerCm3: 22,
    origin: "Italy",
    textureFolder: "statuario",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
    ],
  },

  // 6. Verde Guatemala (Guatemala)
  {
    slug: "verde-guatemala",
    name: {
      en: "Verde Guatemala",
      fr: "Vert Guatemala",
      it: "Verde Guatemala",
      es: "Verde Guatemala",
      de: "Guatemala Grün",
    },
    description: {
      en: "A striking serpentine stone from Central America, Verde Guatemala displays deep forest green tones with lighter veining and occasional white streaks. Its rich color palette brings the vitality of nature indoors. A bold choice for those seeking distinctive character.",
      fr: "Une pierre serpentine saisissante d'Amérique centrale, le Vert Guatemala affiche des tons vert forêt profond avec des veines plus claires et des stries blanches occasionnelles. Sa riche palette de couleurs apporte la vitalité de la nature à l'intérieur. Un choix audacieux pour ceux qui recherchent un caractère distinctif.",
      it: "Una pietra serpentina sorprendente dall'America Centrale, il Verde Guatemala mostra tonalità verde foresta intenso con venature più chiare e occasionali striature bianche. La sua ricca tavolozza di colori porta la vitalità della natura negli interni. Una scelta audace per chi cerca un carattere distintivo.",
      es: "Una llamativa piedra serpentina de América Central, el Verde Guatemala muestra tonos de verde bosque profundo con vetas más claras y rayas blancas ocasionales. Su rica paleta de colores trae la vitalidad de la naturaleza al interior. Una elección audaz para quienes buscan un carácter distintivo.",
      de: "Ein auffälliger Serpentinstein aus Mittelamerika, Guatemala Grün zeigt tiefe Waldgrüntöne mit helleren Adern und gelegentlichen weißen Streifen. Seine reiche Farbpalette bringt die Vitalität der Natur nach drinnen. Eine mutige Wahl für alle, die einen unverwechselbaren Charakter suchen.",
    },
    density: 2750,
    basePricePerCm3: 14,
    origin: "Guatemala",
    textureFolder: "verde-guatemala",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.RAW, priceModifier: FINISH_PRICE_MODIFIERS.RAW },
    ],
  },

  // 7. Rosa Portogallo (Portugal)
  {
    slug: "rosa-portogallo",
    name: {
      en: "Rosa Portogallo",
      fr: "Rose Portugal",
      it: "Rosa Portogallo",
      es: "Rosa Portugal",
      de: "Rosa Portogallo",
    },
    description: {
      en: "From the sun-drenched quarries of Portugal, Rosa Portogallo offers warm pink and salmon hues with subtle cream veining. This romantic stone captures the essence of Mediterranean sunsets. Ideal for creating warm, inviting atmospheres.",
      fr: "Des carrières ensoleillées du Portugal, le Rose Portugal offre des teintes roses et saumon chaleureuses avec des veines crème subtiles. Cette pierre romantique capture l'essence des couchers de soleil méditerranéens. Idéal pour créer des atmosphères chaleureuses et accueillantes.",
      it: "Dalle cave soleggiate del Portogallo, il Rosa Portogallo offre tonalità rosa e salmone calde con sottili venature crema. Questa pietra romantica cattura l'essenza dei tramonti mediterranei. Ideale per creare atmosfere calde e accoglienti.",
      es: "De las canteras bañadas por el sol de Portugal, el Rosa Portugal ofrece tonos rosa y salmón cálidos con sutiles vetas crema. Esta piedra romántica captura la esencia de los atardeceres mediterráneos. Ideal para crear ambientes cálidos y acogedores.",
      de: "Aus den sonnendurchfluteten Steinbrüchen Portugals bietet Rosa Portogallo warme Rosa- und Lachstöne mit dezenten cremefarbenen Adern. Dieser romantische Stein fängt die Essenz mediterraner Sonnenuntergänge ein. Ideal für die Schaffung warmer, einladender Atmosphären.",
    },
    density: 2680,
    basePricePerCm3: 9,
    origin: "Portugal",
    textureFolder: "rosa-portogallo",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
    ],
  },

  // 8. Sahara Noir (Tunisia)
  {
    slug: "sahara-noir",
    name: {
      en: "Sahara Noir",
      fr: "Sahara Noir",
      it: "Sahara Nero",
      es: "Sahara Negro",
      de: "Sahara Schwarz",
    },
    description: {
      en: "Emerging from ancient Tunisian quarries, Sahara Noir presents a sophisticated black canvas with golden and cream fossil patterns. These intricate markings reveal millions of years of natural history. A conversation piece that bridges art and geology.",
      fr: "Issu d'anciennes carrières tunisiennes, le Sahara Noir présente une toile noire sophistiquée avec des motifs fossiles dorés et crème. Ces marques complexes révèlent des millions d'années d'histoire naturelle. Une pièce de conversation qui relie l'art et la géologie.",
      it: "Emergendo dalle antiche cave tunisine, il Sahara Nero presenta una sofisticata tela nera con motivi fossili dorati e crema. Questi segni intricati rivelano milioni di anni di storia naturale. Un pezzo da conversazione che unisce arte e geologia.",
      es: "Surgiendo de antiguas canteras tunecinas, el Sahara Negro presenta un sofisticado lienzo negro con patrones fósiles dorados y crema. Estas intrincadas marcas revelan millones de años de historia natural. Una pieza de conversación que une arte y geología.",
      de: "Aus antiken tunesischen Steinbrüchen stammend, präsentiert Sahara Schwarz eine raffinierte schwarze Leinwand mit goldenen und cremefarbenen Fossilmustern. Diese komplizierten Markierungen enthüllen Millionen Jahre Naturgeschichte. Ein Gesprächsstück, das Kunst und Geologie verbindet.",
    },
    density: 2710,
    basePricePerCm3: 11,
    origin: "Tunisia",
    textureFolder: "sahara-noir",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.BRUSHED, priceModifier: FINISH_PRICE_MODIFIERS.BRUSHED },
    ],
  },

  // 9. Bianco Sivec (North Macedonia)
  {
    slug: "bianco-sivec",
    name: {
      en: "Bianco Sivec",
      fr: "Blanc Sivec",
      it: "Bianco Sivec",
      es: "Blanco Sivec",
      de: "Bianco Sivec",
    },
    description: {
      en: "One of the purest white marbles on Earth, Bianco Sivec from North Macedonia offers an almost crystalline appearance with minimal veining. Its luminous surface reflects light beautifully, creating an ethereal atmosphere. The ultimate choice for minimalist luxury.",
      fr: "L'un des marbres blancs les plus purs au monde, le Blanc Sivec de Macédoine du Nord offre une apparence presque cristalline avec un veinage minimal. Sa surface lumineuse reflète magnifiquement la lumière, créant une atmosphère éthérée. Le choix ultime pour un luxe minimaliste.",
      it: "Uno dei marmi bianchi più puri sulla Terra, il Bianco Sivec della Macedonia del Nord offre un aspetto quasi cristallino con venature minime. La sua superficie luminosa riflette splendidamente la luce, creando un'atmosfera eterea. La scelta definitiva per il lusso minimalista.",
      es: "Uno de los mármoles blancos más puros de la Tierra, el Blanco Sivec de Macedonia del Norte ofrece una apariencia casi cristalina con vetas mínimas. Su superficie luminosa refleja la luz maravillosamente, creando una atmósfera etérea. La elección definitiva para el lujo minimalista.",
      de: "Einer der reinsten weißen Marmore der Erde, Bianco Sivec aus Nordmazedonien bietet ein fast kristallines Erscheinungsbild mit minimaler Maserung. Seine leuchtende Oberfläche reflektiert das Licht wunderschön und schafft eine ätherische Atmosphäre. Die ultimative Wahl für minimalistischen Luxus.",
    },
    density: 2700,
    basePricePerCm3: 16,
    origin: "North Macedonia",
    textureFolder: "bianco-sivec",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
    ],
  },

  // 10. Travertino Romano (Italy)
  {
    slug: "travertino-romano",
    name: {
      en: "Travertino Romano",
      fr: "Travertin Romain",
      it: "Travertino Romano",
      es: "Travertino Romano",
      de: "Römischer Travertin",
    },
    description: {
      en: "The legendary stone of Roman architecture, Travertino Romano features warm beige and ivory tones with characteristic porous textures. From the Colosseum to modern masterpieces, it embodies timeless elegance. Its natural holes and patterns tell stories of ancient mineral springs.",
      fr: "La pierre légendaire de l'architecture romaine, le Travertin Romain présente des tons beige et ivoire chauds avec des textures poreuses caractéristiques. Du Colisée aux chefs-d'œuvre modernes, il incarne l'élégance intemporelle. Ses trous et motifs naturels racontent des histoires de sources minérales anciennes.",
      it: "La leggendaria pietra dell'architettura romana, il Travertino Romano presenta toni caldi beige e avorio con caratteristiche texture porose. Dal Colosseo ai capolavori moderni, incarna l'eleganza senza tempo. I suoi buchi e motivi naturali raccontano storie di antiche sorgenti minerali.",
      es: "La legendaria piedra de la arquitectura romana, el Travertino Romano presenta tonos beige y marfil cálidos con texturas porosas características. Desde el Coliseo hasta obras maestras modernas, encarna la elegancia atemporal. Sus agujeros y patrones naturales cuentan historias de antiguos manantiales minerales.",
      de: "Der legendäre Stein der römischen Architektur, Römischer Travertin, weist warme Beige- und Elfenbeintöne mit charakteristischen porösen Texturen auf. Vom Kolosseum bis zu modernen Meisterwerken verkörpert er zeitlose Eleganz. Seine natürlichen Löcher und Muster erzählen Geschichten von alten Mineralquellen.",
    },
    density: 2400,
    basePricePerCm3: 7,
    origin: "Italy",
    textureFolder: "travertino-romano",
    finishes: [
      { type: FinishType.POLISHED, priceModifier: FINISH_PRICE_MODIFIERS.POLISHED },
      { type: FinishType.HONED, priceModifier: FINISH_PRICE_MODIFIERS.HONED },
      { type: FinishType.RAW, priceModifier: FINISH_PRICE_MODIFIERS.RAW },
    ],
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seed() {
  console.log("🌱 Starting marble seeding...\n");

  try {
    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Step 1: Clean up existing data (idempotent pattern)
      console.log("🧹 Cleaning existing marble finishes...");
      const deletedFinishes = await tx.marbleFinish.deleteMany();
      console.log(`   Deleted ${deletedFinishes.count} finish records`);

      console.log("🧹 Cleaning existing marbles...");
      const deletedMarbles = await tx.marble.deleteMany();
      console.log(`   Deleted ${deletedMarbles.count} marble records\n`);

      // Step 2: Create marbles with their finishes
      console.log("📦 Creating marbles...\n");

      for (const marbleData of MARBLES) {
        const marble = await tx.marble.create({
          data: {
            slug: marbleData.slug,
            name: marbleData.name as object,
            description: marbleData.description as object,
            density: marbleData.density,
            basePricePerCm3: marbleData.basePricePerCm3,
            origin: marbleData.origin,
            textureFolder: marbleData.textureFolder,
            available: true,
            finishes: {
              create: marbleData.finishes.map((finish) => ({
                type: finish.type,
                priceModifier: finish.priceModifier,
              })),
            },
          },
          include: {
            finishes: true,
          },
        });

        console.log(
          `   ✓ ${(marbleData.name as LocalizedString).en} (${marble.finishes.length} finishes)`
        );
      }
    });

    // Step 3: Verify results
    console.log("\n📊 Verifying seed results...");
    const marbleCount = await prisma.marble.count();
    const finishCount = await prisma.marbleFinish.count();

    console.log(`   Total marbles: ${marbleCount}`);
    console.log(`   Total finishes: ${finishCount}`);

    if (marbleCount !== 10) {
      throw new Error(`Expected 10 marbles, got ${marbleCount}`);
    }

    console.log("\n✅ Seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Run seed
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

