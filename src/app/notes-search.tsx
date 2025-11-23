'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {Card, Label, Text, TextInput} from '@gravity-ui/uikit';

type NoteMeta = {
    title?: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
};

type Note = {
    slug: string;
    meta: NoteMeta;
};

type Props = {
    notes: Note[];
};

export function NotesSearch({notes}: Props) {
    const [query, setQuery] = useState('');

    const filteredNotes = useMemo(() => {
        const raw = query.trim().toLowerCase();
        if (!raw) return notes;

        const tokens = raw.split(/\s+/);

        // Теги: все слова, начинающиеся с "#"
        const tagFilters = tokens
            .filter((t) => t.startsWith('#'))
            .map((t) => t.slice(1))
            .filter(Boolean);

        // Остальной текст — обычный поисковый запрос
        const textQuery = tokens
            .filter((t) => !t.startsWith('#'))
            .join(' ')
            .trim();

        return notes.filter((note) => {
            const title = (note.meta.title || note.slug).toLowerCase();
            const description = (note.meta.description || '').toLowerCase();
            const noteTags = (note.meta.tags || []).map((t) => t.toLowerCase());
            const tagsString = noteTags.join(' ');
            const slug = note.slug.toLowerCase();

            const matchesTags =
                tagFilters.length === 0 ||
                tagFilters.every((tag) => noteTags.includes(tag));

            const matchesText =
                !textQuery ||
                title.includes(textQuery) ||
                description.includes(textQuery) ||
                tagsString.includes(textQuery) ||
                slug.includes(textQuery);

            return matchesTags && matchesText;
        });
    }, [notes, query]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        notes.forEach((note) => {
            (note.meta.tags || []).forEach((t) => tags.add(t));
        });
        return Array.from(tags).sort();
    }, [notes]);

    const tagSuggestions = useMemo(() => {
        if (!query.startsWith('#')) return [];

        const clean = query.slice(1).toLowerCase();

        return allTags.filter((tag) =>
            tag.toLowerCase().startsWith(clean),
        );
    }, [query, allTags]);

    return (
        <div className="space-y-4">
            {/* Поиск */}
            <div className="relative">
                <TextInput
                    type="text"
                    size="l"
                    view="normal"
                    hasClear
                    placeholder="Поиск по заметкам и тегам..."
                    value={query}
                    onUpdate={setQuery}
                    qa="notes-search-input"
                />

                {tagSuggestions.length > 0 && (
                    <Card
                        view="outlined"
                        className="
                            absolute left-0 right-0 mt-1
                            z-20 max-h-60 overflow-y-auto
                        "
                    >
                        {tagSuggestions.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setQuery(`#${tag}`)}
                                className="
                                    w-full text-left px-4 py-2 text-sm
                                    hover:bg-slate-100 dark:hover:bg-slate-700
                                "
                            >
                                <Text variant="body-2">#{tag}</Text>
                            </button>
                        ))}
                    </Card>
                )}
            </div>

            <ul className="space-y-3">
                {filteredNotes.length === 0 && (
                    <li>
                        <Text
                            variant="body-2"
                            color="secondary"
                        >
                            Ничего не найдено по запросу «{query}».
                        </Text>
                    </li>
                )}

                {filteredNotes.map((note) => (
                    <li key={note.slug}>
                        <Link href={`/notes/${note.slug}`} className="block">
                            <Card
                                view="outlined"
                                type="container"
                                className="
                                    px-5 py-4
                                    hover:shadow-md
                                    transition-shadow
                                "
                            >
                                <Text
                                    as="h2"
                                    variant="subheader-3"
                                >
                                    {note.meta.title || note.slug}
                                </Text>

                                {note.meta.description && (
                                    <Text
                                        variant="body-2"
                                        color="secondary"
                                        className="mt-1 line-clamp-2"
                                    >
                                        {note.meta.description}
                                    </Text>
                                )}

                                {note.meta.tags &&
                                    note.meta.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {note.meta.tags.map((tag) => (
                                                <Label
                                                    key={tag}
                                                    size="xs"
                                                    theme="info"
                                                    interactive
                                                >
                                                    {tag}
                                                </Label>
                                            ))}
                                        </div>
                                    )}
                            </Card>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
