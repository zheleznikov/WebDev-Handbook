import {Text} from '@gravity-ui/uikit';
import {getNoteSlugs, getNoteBySlug} from '@/lib/notes';
import { NotesSearch } from "@/app/notes-search";

export default function HomePage() {
    const slugs = getNoteSlugs();
    const notes = slugs.map((file) => {
        const slug = file.replace(/\.md$/, '');
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
                    <Text variant="display-3" as="h1">
                        Справочник по JavaScript
                    </Text>

                    <Text
                        variant="body-2"
                        color="secondary"
                        className="mt-2"
                    >
                        Для подготовки к собесу
                    </Text>
                </header>

                <NotesSearch notes={notes} />
            </div>
        </main>
    );
}
