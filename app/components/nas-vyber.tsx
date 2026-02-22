import Image from "next/image";

type WineCard = {
    name: string;
    description: string;
    image: string;
};

const wines: WineCard[] = [
    {
        name: "Barolo Bussia",
        description:
            "Call out a feature, benefit, or value of your site that can stand on its own.",
        image: "/placeholder-wine.png",
    },
    {
        name: "Amarone",
        description:
            "Call out a feature, benefit, or value of your site that can stand on its own.",
        image: "/placeholder-wine.png",
    },
    {
        name: "Costadoro Marche Rosso",
        description:
            "Call out a feature, benefit, or value of your site that can stand on its own.",
        image: "/placeholder-wine.png",
    },
];

export default function NasVyber() {
    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-serif text-black mb-12">
                    Náš výběr
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    {wines.map((wine) => (
                        <div key={wine.name} className="flex flex-col items-center text-center">
                            <div className="relative w-40 h-64 mb-6">
                                <Image
                                    src={wine.image}
                                    alt={wine.name}
                                    fill
                                    className="object-contain"
                                    sizes="160px"
                                />
                            </div>
                            <h3 className="text-lg md:text-xl font-serif font-bold text-black mb-2">
                                {wine.name}
                            </h3>
                            <p className="text-sm md:text-base text-black/60 font-sans max-w-xs leading-relaxed">
                                {wine.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
