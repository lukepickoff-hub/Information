export interface Organism {
  name: string;
  sub: string;
  emoji: string;
  cat: 'Plant' | 'Marine Plant' | 'Fungi' | 'Mammal' | 'Bird' | 'Reptile' | 'Marine Animal' | 'Insect' | 'Amphibian' | 'Mollusk' | 'Prokaryote' | 'Protista';
  env: string;
  cell: string;
}

export const ORGANISMS_DATA: Organism[] = [
  // ── MARINE PLANTS ──
  {
    name: "海带", sub: "Kelp", emoji: "🌿", cat: "Marine Plant",
    env: "Lives submerged in cold, nutrient-rich ocean water with powerful currents and limited light. There is no soil for roots, and the salt concentration is high.",
    cell: "No roots — instead, holdfast cells grip rock like a claw without absorbing. Its blade is a flat sheet of photosynthetic cells directly absorbing dissolved minerals from surrounding water. No vascular system is needed: every cell is already bathed in nutrients. Flexible rubbery tissue lets it bend without snapping in currents."
  },

  // ── LAND PLANTS ──
  {
    name: "甘蔗", sub: "Sugarcane", emoji: "🎋", cat: "Plant",
    env: "Grows in hot, humid tropical regions with intense sunlight, high rainfall, and rich soil. Faces heat stress and strong competition for light.",
    cell: "Uses C4 photosynthesis — a specialized two-stage cell arrangement (mesophyll + bundle sheath cells) that concentrates CO₂, dramatically reducing energy loss in heat. The tall thick stem is packed with parenchyma cells storing sucrose, which is the plant's strategy to lock away energy quickly before it is consumed by respiration."
  },
  {
    name: "葡萄", sub: "Grape", emoji: "🍇", cat: "Plant",
    env: "Grows in temperate, Mediterranean-like climates — warm dry summers, cool winters, well-drained rocky soil. Must cope with drought and climb for sunlight.",
    cell: "Tendrils are modified stem tips whose cells sense touch (thigmotropism) and coil around supports, allowing the plant to climb without a rigid trunk. Deep taproot cells extract water far below the dry surface. The skin's waxy cuticle cells minimize water loss. High sugar content in fruit cells attracts animals for seed dispersal."
  },
  {
    name: "红薯", sub: "Sweet Potato", emoji: "🍠", cat: "Plant",
    env: "Thrives in warm, tropical/subtropical loose soil. Faces seasonal drought and must store energy through dry periods.",
    cell: "The storage organ is a swollen lateral root, where parenchyma cells balloon to enormous size and pack themselves with starch granules. When water is scarce, these cells provide the plant both energy and moisture. The skin is a tight layer of suberized (cork-like) cells that prevents the stored nutrients from drying out."
  },
  {
    name: "土豆", sub: "Potato", emoji: "🥔", cat: "Plant",
    env: "Cool, moist temperate soil. Survives cold winters underground, where it faces darkness, soil microbes, and frost.",
    cell: "The tuber is a modified underground stem (not a root). Its outer layer is a thick skin of dead suberized cells that block pathogens. Inside, large starch-storing parenchyma cells provide enormous energy reserves. The 'eyes' are dormant buds — compact groups of meristematic cells ready to generate a new plant when conditions improve."
  },
  {
    name: "苹果", sub: "Apple", emoji: "🍎", cat: "Plant",
    env: "Temperate climates with cold winters and warm summers. Needs a dormancy period (chilling hours) and experiences strong seasonal swings.",
    cell: "The apple's flesh is a mass of loosely packed parenchyma cells with large air spaces — this makes it crisp yet light. Cold winters trigger dormancy: cells stop dividing and enter a low-metabolic state. The tough waxy skin (epidermis + cuticle cells) protects against UV and insects. Core cells form a hard carpel protecting seeds until an animal eats them and disperses seeds far away."
  },
  {
    name: "香蕉", sub: "Banana", emoji: "🍌", cat: "Plant",
    env: "Hot, humid tropical regions with year-round rainfall and intense sun. No cold season — must grow continuously and resist fungi and pests.",
    cell: "The 'trunk' is not wood — it is a pseudostem of tightly overlapping leaf-base cells with no true lignified xylem. This makes it flexible in tropical storms. The thick green peel is a multi-layered cell wall with astringent tannins that deter insects before ripening. Ripening triggers ethylene-producing cells, softening the flesh and converting starch to sugar to attract animals."
  },
  {
    name: "橙子", sub: "Orange", emoji: "🍊", cat: "Plant",
    env: "Subtropical and Mediterranean climates — warm year-round but cooler dry seasons. Must resist drought and skin-piercing insects.",
    cell: "The thick outer peel contains schizogenous oil gland cells packed with limonene — toxic to most insects. The white pith cells (albedo) act as a shock-absorbing cushion. The juice vesicles inside each segment are individual water-storage cells that burst upon eating, filling with citric acid and sugar to attract seed-disposing animals."
  },
  {
    name: "水稻", sub: "Rice", emoji: "🌾", cat: "Plant",
    env: "Flooded paddies — roots are permanently submerged in waterlogged, oxygen-deprived soil. Also faces intense tropical sun and seasonal floods.",
    cell: "Develops aerenchyma: large hollow air-channel cells that run from leaf to root, piping oxygen down to the root tips even when soil has none. This is a rare cellular adaptation almost absent in dryland plants. The leaf cuticle is heavily waxed to resist splashing water and fungi. Silica cells in leaves make them stiff and difficult for insects to chew."
  },
  {
    name: "菠菜", sub: "Spinach", emoji: "🥬", cat: "Plant",
    env: "Cool, moist temperate fields. Often eaten by herbivores and insects; survives short freezing periods.",
    cell: "Leaves are thin and densely packed with chloroplasts to maximize photosynthesis in weak winter light. Cells accumulate oxalate crystals (raphides) — needle-like calcium oxalate structures that irritate and deter herbivore mouths. In cold, cells increase unsaturated fats in their membranes to stay fluid instead of freezing rigid."
  },
  {
    name: "西红柿", sub: "Tomato", emoji: "🍅", cat: "Plant",
    env: "Warm, sunny, well-drained temperate soil. Needs to attract seed-dispersers while defending against insects.",
    cell: "Stem and leaves are covered in glandular trichomes — tiny secretory cells that produce sticky toxic compounds trapping insects. The fruit's bright red color signals ripeness through lycopene pigment in chromoplast cells. Inside, fluid-filled locule cells store seeds suspended in gel, keeping them moist until an animal swallows and disperses them."
  },
  {
    name: "萝卜", sub: "Radish", emoji: "🫚", cat: "Plant",
    env: "Cool, loose, fertile soil. Grows rapidly and stores nutrients to survive cold seasons underground.",
    cell: "A swollen taproot filled with parenchyma cells enlarged far beyond normal — pure storage capacity. The rapid growth forces these cells to expand by pumping water, making the root juicy and crisp. Glucosinolate compounds produced in specialized cells create the sharp spicy flavor that deters soil-dwelling insects and fungi."
  },
  {
    name: "白菜", sub: "Cabbage", emoji: "🥬", cat: "Plant",
    env: "Cool, moist temperate regions. Survives light frost and faces heavy caterpillar herbivory.",
    cell: "Tightly packed overlapping leaves create a microclimate inside the head — inner cells stay warmer and more moist than outside. The waxy cuticle on each leaf cell repels water and blocks fungal spores. Glucosinolates in cells (mustard-family chemicals) are activated only when cells are torn — a chemical defense that only triggers when a predator bites."
  },
  {
    name: "西瓜", sub: "Watermelon", emoji: "🍉", cat: "Plant",
    env: "Hot, dry, sandy desert-edge and savanna soils. Extreme heat, intense sun, very little water. Originated in African Kalahari.",
    cell: "Deep taproot cells reach water far below. The thick green rind is a tough layer of sclerenchyma cells (hard structural cells) that protects the water-rich interior from desiccation. Inside, the red flesh is 92% water — giant vacuole-filled parenchyma cells acting as biological water tanks. High sugar content evolved to attract large animals to consume and spread seeds far across the dry landscape."
  },
  {
    name: "火龙果", sub: "Dragon Fruit", emoji: "🐉", cat: "Plant",
    env: "Arid and semi-arid tropical regions — extreme heat, low water, intense sun. A cactus-family plant growing on rocky desert walls.",
    cell: "Uses CAM (Crassulacean Acid Metabolism) — its stomata cells open only at night to absorb CO₂, then seal shut during the brutal daytime heat to prevent water loss. CO₂ is stored as malic acid in vacuoles overnight, then used for photosynthesis in sealed cells during the day. The succulent stem cells are enormous water-storage vacuoles. Spines are modified leaves — cells that became hard keratin-like needles to defend against herbivores and shade the surface."
  },
  {
    name: "哈密瓜", sub: "Hami Melon", emoji: "🍈", cat: "Plant",
    env: "Xinjiang desert — extreme temperature swings (scorching days, cold nights), very low humidity, intense sunlight, alkaline soil.",
    cell: "The huge temperature swing drives sugar accumulation: cold nights slow cellular respiration so sugars made during the day can't be burned fast enough — they accumulate in the flesh cells. Thick skin cells with a corky layer prevent water loss in the dry air. Deep roots with specialized ion-exclusion cells manage high soil salt content."
  },
  {
    name: "玫瑰", sub: "Rose", emoji: "🌹", cat: "Plant",
    env: "Temperate regions, often open, sunny environments with competition from grazing animals and insects. Must attract pollinators while defending against herbivores.",
    cell: "Thorns are not leaves or stems — they are modified epidermal cells that harden with lignin, protecting the plant from being eaten. Petal cells are iridescent due to their regular nanoscale structure, maximizing color signal to pollinators. Oil glands (osmophores) in petals release volatile terpenes — the scent that guides bees and other insects across long distances."
  },
  {
    name: "树", sub: "Tree (General)", emoji: "🌳", cat: "Plant",
    env: "Highly varied — forests, mountains, plains. Must compete for light above all others, withstand wind, rain, and decades or centuries of environmental change.",
    cell: "Lignified xylem cells (tracheids and vessel elements) die at maturity, leaving behind rigid hollow tubes that both carry water upward and provide structural support — a dual-purpose dead-cell architecture unique to plants. Bark is layer upon layer of dead suberized cells forming a fire-resistant, pest-resistant armor. Meristematic cells at branch tips and around the trunk allow continuous growth for centuries."
  },
  {
    name: "花", sub: "Flower (General)", emoji: "🌸", cat: "Plant",
    env: "Evolved alongside pollinators in open sunlit environments. Must compete for pollinator attention.",
    cell: "Petal cells have conical surface shapes that scatter and intensify color, making flowers visible from a distance. Nectary cells secrete sucrose-rich liquid as a reward. Anther cells undergo meiosis to produce genetically unique pollen. The entire structure is a temporary organ — cells are programmed to die rapidly after pollination through apoptosis (programmed cell death), redirecting energy to seed development."
  },

  // ── FUNGI ──
  {
    name: "蘑菇", sub: "Mushroom", emoji: "🍄", cat: "Fungi",
    env: "Dark, moist forest floors or decaying wood. No sunlight reaches — photosynthesis is impossible. Nutrients come from dead organic matter.",
    cell: "Fungi cells have a unique cell wall made of chitin (the same material as insect exoskeletons), not cellulose. No chloroplasts exist. Instead, threadlike hyphae cells extend through substrates, secreting digestive enzymes directly onto food and absorbing broken-down molecules through their walls — eating from the outside in. The visible mushroom is just the fruiting body; the true organism is invisible underground mycelium spanning vast areas."
  },

  // ── INSECTS & ARTHROPODS ──
  {
    name: "蚊子", sub: "Mosquito", emoji: "🦟", cat: "Insect",
    env: "Larvae live in stagnant warm water; adults roam humid tropical and temperate air. Must detect and feed on warm-blooded hosts.",
    cell: "The proboscis is a six-part fascicle of stylet cells: two cut skin, two form channels, one delivers anticoagulant saliva, one draws blood. Thermosensory neurons detect body heat at distance. Olfactory receptor cells on antennae detect CO₂ and body odors from 50 meters. Larvae have a siphon — an air-tube cell structure — to breathe at the water surface while remaining submerged."
  },
  {
    name: "苍蝇", sub: "Fly", emoji: "🪰", cat: "Insect",
    env: "Decomposing organic matter, garbage, animal waste. Warm environments globally. Must find food quickly and escape predators in all directions.",
    cell: "Compound eyes contain thousands of individual ommatidia (lens units), each a cluster of cells giving a wide-angle mosaic view — nearly 360° — making sneak attacks nearly impossible. Foot pads have spatula-shaped setae cells coated in adhesive fluid: they can walk on glass upside down. Taste receptors are on the feet — the fly 'tastes' food the moment it lands."
  },
  {
    name: "蚂蚁", sub: "Ant", emoji: "🐜", cat: "Insect",
    env: "Underground colonies with high humidity and varying temperature. Must navigate, carry food many times their own weight, and communicate complex instructions without a central brain.",
    cell: "Exoskeleton cells (cuticle) are layered with wax proteins for waterproofing and structural rigidity. Muscle cells in the thorax are among the strongest per unit mass of any organism — enabling carrying 50x body weight. The gaster contains pheromone-secreting gland cells that release chemical signals encoding nest location, alarm, and food trail — a molecular language written in cellular secretions."
  },
  {
    name: "蜈蚣", sub: "Centipede", emoji: "🐛", cat: "Insect",
    env: "Dark, moist soil and leaf litter. Predatory — hunts in total darkness. Faces prey that can fight back.",
    cell: "Forcipules (the first pair of legs) are modified into venom-injecting appendages: hollow needle-like cells connected to venom glands that produce neurotoxic peptides. Antennae cells are densely packed with mechanoreceptors and chemoreceptors for 3D orientation in complete darkness. The segmented body with independently articulated legs allows movement through irregular soil tunnels with no dead ends."
  },
  {
    name: "蜻蜓", sub: "Dragonfly", emoji: "🪲", cat: "Insect",
    env: "Larvae: aquatic, oxygen-rich freshwater. Adults: open air over ponds and fields. One of the fastest and most maneuverable flying insects.",
    cell: "Four independently controlled wings — each pair of flight muscles can be adjusted separately by the nervous system — giving dragonflies the unique ability to fly backward and hover. Eyes cover nearly the entire head: 30,000 ommatidia give near-360° high-resolution vision essential for catching prey mid-flight. As larvae, gills are inside the rectum — cells lining the rectal chamber absorb oxygen from pumped water, then water is ejected as a jet for propulsion."
  },
  {
    name: "螳螂", sub: "Mantis", emoji: "🦗", cat: "Insect",
    env: "Dense vegetation in tropical and temperate forests. An ambush predator — stays motionless and relies on camouflage.",
    cell: "Raptorial forelegs have interlocking rows of sharp spines — each spine a toughened extension of the cuticle. They snap shut in 30–50ms, faster than most prey can react. The triangular head is the only insect head that can rotate 180°, thanks to a highly flexible neck joint and specialized neck muscle cells. Chromatophore-like pigment cells in the body match bark, leaf, or flower color — some species mimic orchid petals exactly."
  },

  // ── MARINE ANIMALS ──
  {
    name: "海马", sub: "Seahorse", emoji: "🐠", cat: "Marine Animal",
    env: "Seagrass meadows and coral reefs — slow-current environments where camouflage matters more than speed. Very poor swimmers in open water.",
    cell: "Bony dermal plates (not scales) are fused into a rigid exoskeleton-like armor. No caudal fin for swimming — instead, the tail is prehensile (gripping) with specialized flexor cells. A tiny dorsal fin (35 beats/second) provides gentle propulsion. Males have a brood pouch lined with placenta-like vascularized cells that nourish embryos — the only male pregnancy in vertebrates."
  },
  {
    name: "螃蟹", sub: "Crab", emoji: "🦀", cat: "Marine Animal",
    env: "Coastal sandy or rocky seabeds, tidal zones. Experiences alternating immersion and exposure to air. Must protect soft internal organs from crushing and predators.",
    cell: "The exoskeleton is chitin mineralized with calcium carbonate — cells that calcify their own surrounding matrix, creating living armor. Gills are enclosed in a branchial chamber: water is actively pumped through by specialized appendages even when exposed to air, extending survival. Chromatophores — pigment-cell clusters — can be rearranged to camouflage against sand or rock within seconds."
  },
  {
    name: "乌龟", sub: "Turtle", emoji: "🐢", cat: "Marine Animal",
    env: "Aquatic environments (fresh or salt water) with terrestrial nesting. Must survive predation across two very different environments over a very long lifespan (100+ years).",
    cell: "The shell is the vertebral column and ribs fused to dermal bone plates — the skeleton is literally on the outside. Scute cells (specialized keratin) overlay the shell like tiles. Lung cells are highly efficient — turtles can lower metabolic rate so dramatically that they can survive frozen winters by absorbing dissolved oxygen directly through cloacal skin cells (cloacal bursae)."
  },
  {
    name: "鲨鱼", sub: "Shark", emoji: "🦈", cat: "Marine Animal",
    env: "Open ocean — fast-moving, high-pressure environment with large, powerful prey. Must detect blood at extreme dilution and navigate vast distances.",
    cell: "Skeleton is entirely cartilage, not bone — lighter and more flexible than bone, reducing energy cost of swimming. Placoid scales (denticles) are tooth-like dermal cells aligned to reduce turbulence (the same principle used in modern swimsuit design). The Ampullae of Lorenzini are jelly-filled sensory pores with cells that detect the electric fields generated by prey muscles — hunting in total darkness or murky water."
  },
  {
    name: "章鱼", sub: "Octopus", emoji: "🐙", cat: "Marine Animal",
    env: "Rocky seafloor crevices — must squeeze into irregular spaces, hunt prey, and escape predators rapidly. No shell for protection.",
    cell: "No rigid skeleton at all — muscles alone shape the body, allowing it to squeeze through any gap larger than its beak. Chromatophores, iridophores, and papillae cells work together: chromatophores change color (pigment), iridophores change reflectivity (structural color), and papillae cells physically change skin texture — all within 200 milliseconds, the fastest camouflage system in nature. The ink gland releases melanin clouds that also contain tyrosinase, an enzyme that temporarily disables predators' sense of smell."
  },
  {
    name: "水母", sub: "Jellyfish", emoji: "🪸", cat: "Marine Animal",
    env: "Open ocean, both shallow and deep. Minimal food, high drift — a largely passive existence in currents. Must catch prey and deter predators with no brain, no blood, no bones.",
    cell: "The body is 95% water, held together by mesoglea — a jelly-like extracellular matrix with very few cells embedded in it. This makes them nearly invisible and near-neutral in buoyancy at zero energy cost. Nematocysts are the most complex single-cell structures in biology: each is a pressurized cell that fires a hollow barbed thread in under 700 nanoseconds — faster than any muscle could respond — injecting venom into prey."
  },
  {
    name: "海豚", sub: "Dolphin", emoji: "🐬", cat: "Marine Animal",
    env: "Open ocean — warm and cold, surface and mid-water. A highly social, fast-moving predator that must cooperate with others to herd fish.",
    cell: "Blubber is a thick layer of lipid-storing adipocyte cells providing insulation and buoyancy. The streamlined body is encased in smooth skin with no hair — drag-reducing dermal cells. Echolocation is produced by a fatty melon organ (lipid-filled cells) in the forehead that focuses ultrasound clicks, and received by the jawbone conducting vibrations to the inner ear — an entirely cellular acoustic system."
  },
  {
    name: "鲸鱼", sub: "Whale", emoji: "🐋", cat: "Marine Animal",
    env: "Deep and open ocean — vast distances, extreme cold in polar feeding grounds. Largest animals on Earth, need enormous food intake.",
    cell: "Baleen plates are keratinized cells forming comb-like filters that sieve krill from thousands of liters of water per gulp. Blubber can be 50cm thick — enormous adipocytes that serve as both insulation and energy reserve for migrations. Dive-capable myoglobin (oxygen-binding protein) in muscle cells is so concentrated that whale muscle is nearly black, storing enough oxygen for 90-minute dives."
  },

  // ── AMPHIBIANS ──
  {
    name: "蛤蟆", sub: "Toad", emoji: "🐸", cat: "Amphibian",
    env: "Moist terrestrial land near freshwater. Lives on forest floor and grassland — exposed to predators, desiccation, and temperature swings. Must breathe through both skin and lungs.",
    cell: "Skin is permanently permeable — a thin epidermis with no scales or keratin waterproofing, allowing gas exchange directly through the skin surface (cutaneous respiration). This same permeability is a weakness — the toad desiccates rapidly in dry conditions. Compensation: parotoid gland cells on the back secrete bufadienolide toxins — some of the most potent cardiotoxins in nature. The warty surface texture increases toxin gland density."
  },

  // ── REPTILES ──
  {
    name: "蛇", sub: "Snake", emoji: "🐍", cat: "Reptile",
    env: "Highly variable — deserts, rainforests, grasslands, trees, water. No limbs, must hunt prey often larger than the head, and detect the world without ears.",
    cell: "Scales are folded and overlapping keratin cells — dry, tough, and entirely waterproof, allowing conquest of true desert environments unlike amphibians. The jaw has ligament cells (not fused bone) that allow 150° mouth opening to swallow prey whole. Pit organs (in vipers) are membrane-lined pits with infrared-sensing cells detecting temperature differences of 0.003°C — thermal vision that works in total darkness. Venom glands are modified salivary cells that evolved independently multiple times."
  },

  // ── BIRDS ──
  {
    name: "麻雀", sub: "Sparrow", emoji: "🐦", cat: "Bird",
    env: "Urban and suburban environments globally — human-altered landscapes with variable food, weather extremes, and predators.",
    cell: "Hollow pneumatized bones — osteocytes deposit bone in thin struts with air-filled cavities — reducing mass by 30% vs solid bone. Feather cells (barbs + barbules with microscopic hooks) create an aerodynamic and insulating structure from a single keratin fiber network. Urban sparrows show thicker beaks due to shifted developmental cell expression — adapting to harder seeds in cities in as few as 50 generations."
  },
  {
    name: "鸭子", sub: "Duck", emoji: "🦆", cat: "Bird",
    env: "Freshwater ponds and wetlands. Must be waterproof, swim efficiently, and filter small food from water.",
    cell: "Uropygial (preen) gland cells secrete a waxy lipid mixture that the duck distributes over every feather. The waxy coating renders feather barbs completely hydrophobic — water rolls off instantly. Webbed feet have cartilaginous webbing between toe cells for paddling. The broad flat bill contains lamellae — fine comb-like keratin plates lined with touch-receptor cells that filter invertebrates and plant matter from water like a biological sieve."
  },
  {
    name: "鸡", sub: "Chicken", emoji: "🐔", cat: "Bird",
    env: "Originally jungle edge and grassland in Southeast Asia. Ground-dwelling — scratches soil for seeds and insects. Faces temperature extremes.",
    cell: "Strong leg muscles with large slow-twitch fibers for extended walking and scratching. The comb is a fleshy structure richly vascularized — blood flows through it as a radiator, releasing excess heat: a thermoregulation organ made of highly perfused skin cells. Eggs have a mineralized shell secreted by specialized cells in the oviduct — 17,000 pores per shell allowing gas exchange for the embryo inside."
  },
  {
    name: "老鹰", sub: "Eagle", emoji: "🦅", cat: "Bird",
    env: "Open mountain terrain and sky — must spot prey from hundreds of meters altitude in bright sunlight and then dive at 150 km/h.",
    cell: "The retina has two foveas (zones of maximum cell density) — one for forward vision, one for lateral — giving simultaneous sharp vision in two directions. Cone cell density is 5× higher than humans, providing extreme color and detail resolution. Talons are keratin-sheathed bones with flexor tendons that lock in a grip so powerful the bird cannot release it voluntarily. Hollow bones + air sacs (connected to lungs) make the entire skeleton a respiratory chamber."
  },
  {
    name: "鹦鹉", sub: "Parrot", emoji: "🦜", cat: "Bird",
    env: "Tropical and subtropical rainforests — complex 3D environment with dense canopy, abundant fruit, and need to climb and grip branches in all orientations.",
    cell: "Zygodactyl feet: two toes forward, two back — with strong flexor tendons enabling a power grip for hanging upside-down. The syrinx (voice organ) has multiple independently controlled pairs of muscles with extraordinary neuromuscular precision — more motor neurons per muscle fiber than most birds — enabling pitch and timbre mimicry. Dense myelination of auditory-motor pathways supports vocal learning."
  },
  {
    name: "猫头鹰", sub: "Owl", emoji: "🦉", cat: "Bird",
    env: "Dense forests and open fields — hunts at night in near-complete darkness and total silence.",
    cell: "Rod photoreceptor cells in the retina outnumber cones dramatically — extreme night sensitivity at the cost of color vision. The eye is a tube (not a sphere) fixed in the skull — so the owl cannot move its eyes, but rotates its head 270° via specialized vertebral blood-vessel bypass cells that prevent blood flow cutoff during rotation. Asymmetrical ear placement (left ear higher than right) allows triangulating sound in 3D — detected by neurons that compare microsecond timing differences between ears."
  },
  {
    name: "乌鸦", sub: "Crow", emoji: "🐦‍⬛", cat: "Bird",
    env: "Highly variable — urban, forest, coastal. Highly social, omnivorous, and faces human environments with complex problem-solving demands.",
    cell: "The pallium (bird 'cortex') has neuron density comparable to primates despite much smaller brain size. Crows have the highest encephalization quotient of any bird. Tool-use behavior correlates with enlarged nidopallium caudolaterale — a brain region convergently similar to mammalian prefrontal cortex. Long-term memory cells store face recognition and specific individual human identities for years."
  },
  {
    name: "企鹅", sub: "Penguin", emoji: "🐧", cat: "Bird",
    env: "Antarctic ocean and ice — water near freezing, brutal wind chill on land, and long fasting periods during breeding.",
    cell: "Feathers are scale-like, short, and densely packed (three times the density of flying birds) — creating a fur-like waterproof insulating mat. Blubber cells (up to 3cm thick) provide both thermal insulation and an energy bank for 4-month fasting. Wings became rigid flippers — bones are flattened and dense (not hollow like flying birds), acting as hydrodynamic foils rather than aerodynamic ones."
  },
  {
    name: "鸵鸟", sub: "Ostrich", emoji: "🦤", cat: "Bird",
    env: "Hot, dry African savanna and desert. Must cover huge distances on foot, face large predators, and survive extreme heat with minimal water.",
    cell: "Wings are vestigial — flight muscle cells were repurposed into wing-display and balance organs. Leg muscle fibers are among the largest in any bird: powerful fast-twitch fibers generate 2,700 Newtons of force per step, enabling 70 km/h sprinting. Each foot has only two toes — reducing ground contact area and allowing a longer stride. Large eyes (5cm diameter) with the most UV-filtering cells of any land animal protect against intense savanna sunlight."
  },

  // ── MAMMALS ──
  {
    name: "猪", sub: "Pig", emoji: "🐷", cat: "Mammal",
    env: "Temperate woodland and farmland. Omnivorous ground-forager living in variable conditions — wet, dry, hot, cold. Needs to efficiently convert varied food to body mass.",
    cell: "Adipocyte (fat) cells proliferate rapidly and efficiently — pigs convert feed to body mass at high rates. Highly similar cell biology to humans: same organ architecture, similar immune cell receptors, making pigs invaluable for xenotransplantation research. Snout has high concentration of Merkel disc mechanoreceptor cells — extremely sensitive touch for rooting and food evaluation."
  },
  {
    name: "猫", sub: "Cat", emoji: "🐱", cat: "Mammal",
    env: "Variable — originally arid African savanna and desert. An ambush predator that must stalk, sprint, and pounce in low light.",
    cell: "Retinal tapetum lucidum — a reflective cell layer behind photoreceptors that bounces light through the retina twice, doubling photon capture in dim conditions. Retractable claws are sheaths of modified epithelial cells — claws retract into a pouch to stay sharp. Whiskers (vibrissae) are deep-rooted in mechanoreceptor-rich follicle cells, detecting air pressure changes from moving prey. Vertical-slit pupil can dilate 135× (vs humans' 15×), the greatest range of any land animal."
  },
  {
    name: "狗", sub: "Dog", emoji: "🐕", cat: "Mammal",
    env: "Temperate variable landscapes — originally steppe and forest. A pack hunter that pursues prey over long distances through stamina, not speed.",
    cell: "Eccrine sweat glands are only in paw pads — body cooling is done by evaporation from the tongue and upper respiratory tract cells (panting). The olfactory epithelium has 300 million olfactory receptor cells (humans have 6 million) with 100× more types of odor receptors — smell is their primary model of the world. Long-distance running is enabled by deep chest cavity housing large lung and heart cells with high capacity."
  },
  {
    name: "牛", sub: "Cow", emoji: "🐄", cat: "Mammal",
    env: "Open grassland. Must extract maximum nutrition from grass — one of the most nutritionally poor and hard-to-digest foods available.",
    cell: "Four-chambered stomach with specialized cell lining in each chamber. The rumen (chamber 1) contains billions of microbial cells — bacteria, protozoa, fungi — that break down cellulose with cellulase enzymes no mammal cell can produce. Cows regurgitate and re-chew (ruminate) to increase surface area for microbial digestion. This cellular cooperation between mammal and microbe unlocks energy sources inaccessible to other animals."
  },
  {
    name: "蝙蝠", sub: "Bat", emoji: "🦇", cat: "Mammal",
    env: "Caves for roosting, night sky for hunting. Must navigate and hunt in complete darkness. Caves are cold — extended torpor is required.",
    cell: "Patagium wing membrane is a double layer of skin cells stretched between elongated finger bones — the most elaborate skin cell specialization in mammals. Laryngeal echolocation: specialized larynx muscle cells produce ultrasonic pulses (20–200 kHz); cochlear hair cells in the inner ear are tuned to specific frequencies and organized topographically by frequency. Brown adipose tissue (brown fat cells) generate non-shivering heat via uncoupling protein during arousal from hibernation."
  },
  {
    name: "老鼠", sub: "Rat", emoji: "🐀", cat: "Mammal",
    env: "Underground burrows and urban environments — dark, narrow, damp. Faces constant predation pressure and requires rapid reproduction.",
    cell: "Incisors have ameloblast cells at the base that never stop producing enamel — so teeth grow continuously and are worn away by gnawing, self-sharpening as the softer dentine behind wears faster. Whisker follicle cells connect to the somatosensory barrel cortex with one-to-one neuron mapping — rats build spatial maps of tunnels through whisker touch. High reproductive rate: uterine cells support multiple implantation sites simultaneously."
  },
  {
    name: "狼", sub: "Wolf", emoji: "🐺", cat: "Mammal",
    env: "Boreal forest, tundra, and mountains — vast cold territories. A cursorial predator that covers 40–70 km/day in pack pursuit hunts.",
    cell: "Deep chest (sternum and ribs wide apart) houses disproportionately large heart and lung cells — a cardiovascular system built for sustained aerobic output. Paw pad cells are richly vascularized with countercurrent heat-exchange: warm arterial blood heats cold venous return from paw, keeping core temperature stable in snow. Scent-marking involves specialized sebaceous and anal gland cells that produce individually distinct chemical signatures."
  },
  {
    name: "袋鼠", sub: "Kangaroo", emoji: "🦘", cat: "Mammal",
    env: "Hot, dry Australian grassland and scrubland. Scarce water, low-nutrition vegetation, and vast open terrain requiring efficient long-distance travel.",
    cell: "Tendon cells in the hind legs store elastic energy like springs — each hop recovers 70% of energy from the previous one, meaning faster hopping actually costs less energy. Kidney tubule cells are highly efficient — concentrating urine far beyond most mammals to conserve water. The pouch is lined with specialized mammary and immune cells: joeys are born undeveloped (fetus-stage) and complete development in the pouch, receiving milk that changes composition as the joey matures."
  },
  {
    name: "大象", sub: "Elephant", emoji: "🐘", cat: "Mammal",
    env: "African savanna and Asian forest — extreme heat, long dry seasons, and the need to process enormous quantities of low-quality vegetation.",
    cell: "The trunk contains ~40,000 muscle fascicles — no bone, pure muscular hydrostat made of cells that can generate force in any direction. Ear skin is richly vascularized on the back surface: blood circulates through thin ear flaps, radiating heat to cool the body in 40°C heat. Temporal gland cells secrete musth fluid — a testosterone-linked secretion used in social communication. Molar cells are replaced horizontally (not vertically like most mammals) — new teeth move forward as old ones wear out, up to six replacements in a lifetime."
  },
  {
    name: "老虎", sub: "Tiger", emoji: "🐯", cat: "Mammal",
    env: "Dense tropical and subtropical forest. A solitary ambush predator of large prey — must remain invisible until the final burst of speed.",
    cell: "Stripe pigmentation (melanocyte cells following Turing reaction-diffusion patterns) breaks up body outline in dappled forest light — effective even in grass. Retractable claw sheaths keep keratin claws razor-sharp until needed. Jaw muscles (masseter and temporalis cells) generate ~1,500 Newtons of bite force — enough to penetrate skull. Fast-twitch muscle fiber percentage is among the highest of any land mammal."
  },
  {
    name: "狮子", sub: "Lion", emoji: "🦁", cat: "Mammal",
    env: "Open African savanna — high visibility, large prey, and cooperative social structure. The only truly social cat.",
    cell: "Male mane is composed of guard hair cells influenced by testosterone — a direct cellular readout of hormonal status signaling fitness to females and warning to rivals. Cooperative hunting requires high neural connectivity in the prefrontal cortex for coordinated group behavior. Rough tongue is covered in papillae with keratinized spine cells facing backward — acting as a comb for grooming and a rasp for stripping flesh from bone."
  },
  {
    name: "猴子", sub: "Monkey", emoji: "🐒", cat: "Mammal",
    env: "Tropical forest canopy — a complex 3D environment requiring fine motor control, social intelligence, and color-based food selection.",
    cell: "Trichromatic color vision (three types of cone cells: red, green, blue) allows distinguishing ripe from unripe fruit, young red leaves (high protein) from old green ones — a major advantage over most mammals with only two cone types. Opposable thumbs — precision grip enabled by specialized flexor tendon anatomy and enhanced motor cortex representation of finger cells. Social grooming activates oxytocin-producing cells, reinforcing coalition bonds."
  },
  {
    name: "犀牛", sub: "Rhino", emoji: "🦏", cat: "Mammal",
    env: "African savanna and Asian grassland. Large body size, solitary, and must defend itself from predators and rivals through armor and charge.",
    cell: "Skin dermis is 2–5 cm thick — dense collagen fiber layers arranged in cross-hatching provide flexibility and puncture resistance. The horn is entirely keratin (no bone) — same protein as fingernails, secreted by keratinocyte cells at the horn base and growing continuously. Poor photoreceptor density in the eye is compensated by an exceptionally large olfactory epithelium — smell is the primary sense."
  },
  {
    name: "长颈鹿", sub: "Giraffe", emoji: "🦒", cat: "Mammal",
    env: "African savanna — open terrain with acacia trees. Must reach food sources 6 meters up that no other ground mammal can access.",
    cell: "Cervical vertebrae are the same count as all mammals (7) but each one is vastly elongated — osteocytes deposited bone in elongated growth plates. The heart is the size of a bucket (~11 kg) with exceptionally thick ventricular muscle cells to pump blood 2.5 meters uphill to the brain. Specialized valves in neck veins prevent blood rush to the brain when the giraffe bends to drink. Tongue epidermis is darkly melanized (near-black) — UV protection from spending hours exposed while browsing."
  },
  {
    name: "驴", sub: "Donkey", emoji: "🫏", cat: "Mammal",
    env: "Arid, rocky, mountainous terrain in North Africa and Middle East. Scarce food, irregular water, rough terrain — a harsh low-input environment.",
    cell: "Hoof cells are exceptionally hard and dense — adapted to impact on rocks with minimal cushioning. The cecum (large fermentation chamber) is lined with absorptive cells that extract nutrients from fibrous, low-quality vegetation more efficiently than horses. Leg bones are narrower and denser — suited to narrow mountain paths requiring precise foot placement."
  },
  {
    name: "狐狸", sub: "Fox", emoji: "🦊", cat: "Mammal",
    env: "Temperate to arctic variable environments — forest, tundra, suburban. An opportunistic hunter of small prey with acute hearing.",
    cell: "Large ears are richly supplied with blood vessels on the inner surface — both heat radiators (in warm climates) and acoustic funnels. Ear pinnae cells are mobile via auricular muscles — foxes can rotate ears to triangulate sound location with millisecond precision. Arctic foxes have a thicker underfur of hollow-shaft hair cells trapping air for insulation, switchable between white and brown coat via seasonal melanocyte regulation."
  },
  {
    name: "熊猫", sub: "Panda", emoji: "🐼", cat: "Mammal",
    env: "High-altitude bamboo forests of China — cold, misty, dense vegetation. A carnivore digestive system that now eats almost exclusively bamboo.",
    cell: "A 'false thumb' (enlarged radial sesamoid bone) is wrapped in a muscle-cell pad, enabling bamboo stripping — not a true digit but a convergent solution. The gut lacks the cellulase enzymes to digest cellulose — instead, specialized gut bacteria cells in the colon break down bamboo. This means pandas absorb only 17% of food energy — compensated by spending 14 hours/day eating. Black-and-white pigmentation (melanocyte mosaic) may serve thermoregulation across temperature-variable terrain."
  },
  {
    name: "羊", sub: "Sheep", emoji: "🐑", cat: "Mammal",
    env: "Grassland and mountain meadow — open, exposed terrain with cold winters and grazing as the sole food source.",
    cell: "Wool fibers are cortical keratin cells with a unique crimped structure that traps air for insulation — the most effective natural insulator per gram. Rumen microbiota cells break down cellulose from grass. Hooves have a split structure — two independently moveable toes with elastic digital cushion cells absorbing shock on rocky mountain terrain. Pupils are rectangular (panoramic field of view) — retinal ganglion cells are spread in a horizontal band maximizing 320° ground-level threat detection."
  },
  {
    name: "松鼠", sub: "Squirrel", emoji: "🐿️", cat: "Mammal",
    env: "Deciduous and conifer forests with seasonal food abundance and winter scarcity. Must cache food, navigate 3D tree environments, and survive cold.",
    cell: "Cheek pouches in some squirrels are skin-lined expandable sacs that stretch via elastic fiber cells — enabling transport of dozens of seeds in one trip. Hippocampal cells for spatial memory are significantly enlarged in autumn — neurogenesis temporarily increases to store thousands of cache locations. Tail hair cells are arranged to create a broad, flat parasol — balance counterweight, sun shield, and visual signal to predators."
  },
  {
    name: "兔子", sub: "Rabbit", emoji: "🐇", cat: "Mammal",
    env: "Open grassland, meadows, and forest edges. A prey animal under constant predation pressure — must detect threats early and flee explosively.",
    cell: "Long ears with dense capillary networks function as thermoregulators — blood is cooled by air as it moves through thin ear skin, preventing overheating during sprint-escape. Hind leg fast-twitch muscle cells provide explosive acceleration (0 to 70 km/h in a few strides). Cecotrophy: special cecal cells ferment plant matter into nutrient-rich pellets that the rabbit re-ingests — a second digestion cycle that extracts vitamins and amino acids missed the first time."
  },
  {
    name: "斑马", sub: "Zebra", emoji: "🦓", cat: "Mammal",
    env: "African savanna — extreme heat, open grassland, large herds, and predation from lions and hyenas.",
    cell: "Stripe pattern is generated by melanocyte cells following reaction-diffusion equations during fetal development — each stripe boundary is a zone where melanocyte activation switches on or off. Research suggests stripes may confuse biting flies (optical motion dazzle) and/or assist with thermoregulation — dark stripes absorb heat creating air convection currents. Herd movement is coordinated through visual stripe-pattern recognition cells — individuals stay close by maintaining visual signal with neighbor."
  },

  // ── MOLLUSKS ──
  {
    name: "蜗牛", sub: "Snail", emoji: "🐌", cat: "Mollusk",
    env: "Moist, terrestrial or freshwater environments — under leaves, in gardens, near water. Moves slowly and has no ability to flee predators quickly.",
    cell: "The shell is secreted by the mantle — specialized epithelial cells called conchiolin cells that deposit calcium carbonate in a spiral matrix. The shell grows from the outside edge, adding new layers continuously. The foot is a single large muscular cell-mass with coordinated ciliary cells underneath — producing mucus via mucous gland cells that lubricates movement and allows climbing vertical glass. The mucus is also predator-deterrent."
  },
  
  // ── PROKARYOTES ──
  {
    name: "大肠杆菌", sub: "Escherichia coli", emoji: "🦠", cat: "Prokaryote",
    env: "Lives inside mammalian intestines or soil water. Faces warm temperatures, varying oxygen levels, and nutrient turbulence.",
    cell: "A model prokaryote. Standard pill-shaped bacterial wrapper with peptidoglycan walls cross-linked by transpeptidase enzymes. DNA floats freely as a single circular chromosome in the nucleoid. Uses 70S ribosomes. Lacks mitochondria; instead, respiratory enzymes sit inside the plasma membrane."
  },
  {
    name: "产甲烷菌", sub: "Methanogen (Archaea)", emoji: "🌋", cat: "Prokaryote",
    env: "Extreme anaerobic environments like hydrothermal vents, deep mud, or animal rumens. Lacks oxygen.",
    cell: "Archaea domain. Outer shell has pseudopeptidoglycan walls, chemically distinct from bacteria. Cell membrane lipids use ether bonds instead of ester bonds to withstand extreme heat and acid. Energy is produced via methanogenesis: fixing CO₂ and H₂ into methane greenhouse gases."
  },

  // ── PROTISTA ──
  {
    name: "硅藻", sub: "Diatom", emoji: "💎", cat: "Protista",
    env: "Floating in sunlit surface ocean layers globally. Needs light and dissolved silica to build shells.",
    cell: "Single-celled eukaryotic algae. Builds a glass-like shell (frustule) out of hydrated silicon dioxide (SiO₂·nH₂O) with nanoscale pores for gas exchange. Produces up to 25% of Earth's oxygen via active chloroplast divisions. Diatoms are primary oceanic food foundations."
  },
  {
    name: "草履虫", sub: "Paramecium", emoji: "🧬", cat: "Protista",
    env: "Freshwater ponds with organic debris. Must swim to find food and prevent bursting from taking in fresh water.",
    cell: "Slipper-shaped ciliate. Thousands of microscopic cilia beat in waves for rapid swimming. Possesses a macronucleus (regulates cell metabolism) and a micronucleus (for conjugation sexual mating). Contains contractile vacuoles that pump out water to survive low-osmosis freshwater swells."
  }
];
