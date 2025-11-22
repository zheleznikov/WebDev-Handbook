import { getNoteBySlug, getNoteSlugs } from "@/lib/notes";
import { remark } from "remark";
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";

type NotePageProps = {
    params: Promise<{ slug: string }>;
};

export const runtime = "nodejs";

export default async function NotePage({ params }: NotePageProps) {
    const { slug } = await params;

    const note = getNoteBySlug(slug);

    const allNotes = getNoteSlugs().map((file) => {
        const s = file.replace(/\.md$/, "");
        return getNoteBySlug(s);
    });
    const currentTags = Array.isArray(note.meta.tags) ? note.meta.tags : [];

    const relatedNotes =
        currentTags.length === 0
            ? []
            : allNotes.filter((other) => {
                if (other.slug === note.slug) return false;
                const otherTags = Array.isArray(other.meta.tags) ? other.meta.tags : [];
                return otherTags.some((tag) => currentTags.includes(tag));
            });

    const processed = await remark()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(note.content);

    const contentHtml = processed.toString();

    return (
        <main
            className="
            min-h-screen bg-neutral-50
            dark:bg-slate-950
            transition-colors
        "
        >
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
                {/* Заголовок страницы */}
                <header className="mb-6">
                    <h1
                        className="
                        text-xs font-medium uppercase tracking-[0.2em]
                        text-slate-400 mb-1
                        dark:text-slate-500
                    "
                    >
                        {`<${note.meta.title || note.slug}/>`}
                    </h1>

                    {note.meta.description && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {note.meta.description}
                        </p>
                    )}

                    {currentTags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {currentTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="
                                    inline-flex items-center rounded-full
                                    border border-emerald-100 bg-emerald-50
                                    px-2.5 py-0.5 text-xs font-medium
                                    text-emerald-700

                                    dark:border-emerald-900/40
                                    dark:bg-emerald-900/20
                                    dark:text-emerald-300
                                "
                                >
                                {tag}
                            </span>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    className="
                    relative rounded-2xl border border-slate-200 bg-white/90 shadow-sm
                    dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-md
                    transition-colors
                "
                >
                    <div className="absolute right-3 top-3">
                        <ShareButton
                            title={note.meta.title || note.slug}
                            description={note.meta.description}
                        />
                    </div>

                    <div className="px-4 sm:px-6 py-5">
                        <article
                            className="prose-notes"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    </div>
                </div>

                {relatedNotes.length > 0 && (
                    <section className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                            Другие материалы по теме
                        </h2>
                        <ul className="space-y-2">
                            {relatedNotes.map((related) => (
                                <li key={related.slug}>
                                    <Link
                                        href={`/notes/${related.slug}`}
                                        className="
                                        text-sm text-blue-600 hover:underline
                                        dark:text-blue-400
                                    "
                                    >
                                        {related.meta.title || related.slug}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </main>
    );

}
