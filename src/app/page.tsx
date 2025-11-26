import { getNoteBySlug, getNoteSlugs } from '@/lib/notes';
import { NotesSearch } from "@/app/notes-search";

export default function HomePage() {
    const slugs = getNoteSlugs();
    const notes = slugs.map((file) => {
        const slug = file.replace(/\.md$/, '');
        return getNoteBySlug(slug);
    });

    return (
        <div className="max-w-3xl mx-auto pt-20">
            <NotesSearch notes={notes} />
        </div>
    );
}
