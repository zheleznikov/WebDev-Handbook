import { getNoteBySlug, getNoteSlugs } from "@/lib/notes";
import { remark } from "remark";
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { ShareButton } from "@/components/ShareButton";
import { Card, Label, Link, Text } from "@gravity-ui/uikit";
import { Calendar, PersonFill } from "@gravity-ui/icons";
import { Metadata } from "next";

type NotePageProps = {
    params: Promise<{ slug: string }>;
};

export const runtime = "nodejs";

export async function generateMetadata(
    { params }: NotePageProps
): Promise<Metadata> {
    const { slug } = await params;
    const note = getNoteBySlug(slug);

    const title = note.meta.title || slug;
    const description =
        note.meta.description ||
        `Заметка по теме: ${title}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            authors: note.meta.author ? [note.meta.author] : undefined,
            tags: Array.isArray(note.meta.tags) ? note.meta.tags : [],
        },
        keywords: Array.isArray(note.meta.tags)
            ? note.meta.tags.join(", ")
            : undefined,
    };
}

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
        <main className="min-h-screen transition-colors">
            <div className="mx-auto w-full px-0 sm:px-6 py-8 sm:max-w-3xl">
                <Card
                    view="outlined"
                    className="
                        relative rounded-2xl
                        shadow-sm
                    "
                >
                    <div className="px-4 sm:px-6 py-5">
                        <article
                            className="prose-notes"
                            dangerouslySetInnerHTML={{__html: contentHtml}}
                        />
                    </div>

                    <div
                        className="
                            flex items-center justify-between
                            px-4 sm:px-6 py-4 text-sm
                        "
                        style={{
                            borderTop: "1px solid var(--g-color-line-generic)",
                        }}
                    >
                        {note.meta.date ? (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <Text variant="body-3" color="secondary">
                                    {note.meta.date}
                                </Text>
                            </div>
                        ) : (
                            <span />
                        )}

                        {note.meta.author && (
                            <div className="flex items-center gap-1.5">
                                <PersonFill className="h-4 w-4" />
                                <Text variant="body-3" color="secondary">
                                    {note.meta.author}
                                </Text>
                            </div>
                        )}
                    </div>
                    <div
                        className="
                            flex items-center justify-between
                            py-2 px-2
                        "
                        style={{
                            borderTop: "1px solid var(--g-color-line-generic)",
                        }}
                    >
                            <div className="flex-1">
                                {currentTags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5 pl-4">
                                        {currentTags.map((tag) => (
                                            <Label
                                                key={tag}
                                                size="xs"
                                                theme="info"
                                                className="cursor-default"
                                            >
                                                {tag}
                                            </Label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <ShareButton
                                title={note.meta.title || note.slug}
                                description={note.meta.description}
                            />
                    </div>
                </Card>

                {relatedNotes.length > 0 && (
                    <section
                        className="mt-4 pt-6 pl-8 sm:pl-0"
                    >
                        <Text
                            as="h2"
                            variant="body-3"
                            className="font-semibold mb-3"
                        >
                            Другие материалы по теме
                        </Text>

                        <ul className="space-y-2">
                            {relatedNotes.map((related) => (
                                <li key={related.slug}>
                                    <Link
                                        type={"primary"}
                                        href={`/notes/${related.slug}`}
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
