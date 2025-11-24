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
            className="min-h-screen py-12"
        >
            <div className="max-w-3xl mx-auto">
                <NotesSearch notes={notes} />
            </div>
        </main>
    );
}
