import { getNoteSlugs, getNoteBySlug } from "@/lib/notes";
import { NotesSearch } from "./notes-search";

export default function HomePage() {
    const slugs = getNoteSlugs();
    const notes = slugs.map((file) => {
        const slug = file.replace(/\.md$/, "");
        return getNoteBySlug(slug);
    });

    return (
        <main
            className="
                min-h-screen
                bg-stone-50 px-4 py-12
                dark:bg-slate-950
                transition-colors
            "
        >
            <div className="max-w-3xl mx-auto">
                {/* Заголовок */}
                <header className="mb-8">
                    <h1
                        className="
                            text-4xl font-bold tracking-tight
                            text-slate-900
                            dark:text-slate-50
                        "
                    >
                        Справочник по JavaScript
                    </h1>
                    <p
                        className="
                            mt-2
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Для подготовки к собесу
                    </p>
                </header>

                <NotesSearch notes={notes} />
            </div>
        </main>
    );
}
