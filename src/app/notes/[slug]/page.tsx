import { getNoteBySlug, getNoteSlugs } from "@/lib/notes";
import { remark } from "remark";
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";
import { CalendarDays, User } from "lucide-react";
import {Card, Label, Text} from "@gravity-ui/uikit";

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
            <div className="mx-auto w-full px-0 sm:px-6 py-8 sm:max-w-3xl">
                {/* Заголовок страницы */}
                <header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    {/* Левая колонка: заголовок + описание + теги */}
                    <div className="flex-1">
                        <Text
                            as="h1"
                            className="pl-4"
                        >
                            {note.meta.title || note.slug}
                        </Text>

                        {note.meta.description && (
                            <Text
                                as="p"
                                variant="body-2"
                                color="secondary"
                                className="mt-2"
                            >
                                {note.meta.description}
                            </Text>
                        )}

                        {currentTags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5 pl-4">
                                {currentTags.map((tag) => (
                                    <Label
                                        key={tag}
                                        size="xs"
                                        theme="info"
                                        className="
                                        cursor-default
                                    "
                                    >
                                        {tag}
                                    </Label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Правая колонка: Share button */}
                    <div className="pl-4 sm:pl-0 sm:pt-1">
                        <ShareButton
                            title={note.meta.title || note.slug}
                            description={note.meta.description}
                        />
                    </div>
                </header>

                {/* Основной контент заметки */}
                <Card
                    view="outlined"
                    className="
                    relative rounded-2xl
                    dark:border-slate-700 dark:bg-slate-900/90
                    shadow-sm dark:shadow-md
                    transition-colors
                "
                >
                    <div className="px-4 sm:px-6 py-5">
                        <article
                            className="prose-notes"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    </div>

                    {/* Подвал карточки: дата слева, автор справа */}
                    <div
                        className="
                        flex items-center justify-between
                        px-4 sm:px-6 py-4 border-t
                        border-slate-200 dark:border-slate-700
                        text-sm text-slate-500 dark:text-slate-400
                    "
                    >
                        {note.meta.date ? (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <Text variant="body-3" color="secondary">
                                    {note.meta.date}
                                </Text>
                            </div>
                        ) : (
                            <span />
                        )}

                        {note.meta.author && (
                            <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <Text variant="body-3" color="secondary">
                                    {note.meta.author}
                                </Text>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Блок похожих заметок */}
                {relatedNotes.length > 0 && (
                    <section className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-6 pl-8 sm:pl-0">
                        <Text
                            as="h2"
                            variant="body-2"
                            className="font-semibold mb-3"
                        >
                            Другие материалы по теме
                        </Text>

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
