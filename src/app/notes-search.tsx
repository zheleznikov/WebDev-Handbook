'use client';

import { useMemo, useState } from 'react';
import { Card, Label, Text, TextInput, Link } from '@gravity-ui/uikit';
import { ArrowRight } from "@gravity-ui/icons";

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

        const tagFilters = tokens
            .filter((t) => t.startsWith('#'))
            .map((t) => t.slice(1))
            .filter(Boolean);

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


    return (
        <div className="space-y-4">

            <div className="relative">
                <TextInput
                    type="text"
                    size="xl"
                    view="normal"
                    hasClear
                    placeholder="Поиск по заметкам и тегам..."
                    value={query}
                    onUpdate={setQuery}
                />
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
                        <Card
                            theme="info"
                            view="raised"
                            type="container"
                            className="px-5 py-4 relative"
                        >
                            <div className="pr-10">
                                <Text as="h2" variant="subheader-3">
                                    {note.meta.title || note.slug}
                                </Text>

                                {note.meta.tags && note.meta.tags?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {note.meta.tags.map((tag) => (
                                            <Label
                                                onClick={() => setQuery(`#${tag}`)}
                                                interactive
                                                key={tag}
                                                size="xs"
                                                theme="info"
                                            >
                                                {tag}
                                            </Label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link href={`/notes/${note.slug}`}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}
