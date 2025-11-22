"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NoteMeta = {
    title?: string;
    description?: string;
    tags?: string[];
};

type Note = {
    slug: string;
    meta: NoteMeta;
};

type Props = {
    notes: Note[];
};

export function NotesSearch({ notes }: Props) {
    const [query, setQuery] = useState("");

    const filteredNotes = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return notes;

        // режим поиска по тегу: "#async"
        if (q.startsWith("#")) {
            const tagQuery = q.slice(1); // убираем "#"

            return notes.filter((note) => {
                const tags = (note.meta.tags || []).map((t) => t.toLowerCase());
                return tags.includes(tagQuery);
            });
        }

        // обычный поиск
        return notes.filter((note) => {
            const title = (note.meta.title || note.slug).toLowerCase();
            const description = (note.meta.description || "").toLowerCase();
            const tags = (note.meta.tags || []).join(" ").toLowerCase();

            return (
                title.includes(q) ||
                description.includes(q) ||
                tags.includes(q) ||
                note.slug.toLowerCase().includes(q)
            );
        });
    }, [notes, query]);


    return (
        <div className="space-y-4">

            {/* Поиск */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Поиск по заметкам и тегам..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="
                    w-full rounded-xl border border-slate-300
                    bg-white/80 text-slate-900
                    px-4 py-2.5 text-sm shadow-sm
                    placeholder:text-slate-400

                    dark:bg-slate-900/60 dark:border-slate-700
                    dark:text-slate-100 dark:placeholder:text-slate-500

                    focus:outline-none focus:ring-2 focus:ring-blue-500/60
                    focus:border-blue-500
                    transition-colors
                "
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-xs text-slate-400 hover:text-slate-600

                        dark:text-slate-500 dark:hover:text-slate-300
                        transition-colors
                    "
                    >
                        Очистить
                    </button>
                )}
            </div>

            {/* Список заметок */}
            <ul className="space-y-3">
                {filteredNotes.length === 0 && (
                    <li className="text-sm text-slate-400 dark:text-slate-500">
                        Ничего не найдено по запросу «{query}».
                    </li>
                )}

                {filteredNotes.map((note) => (
                    <li key={note.slug}>
                        <Link
                            href={`/notes/${note.slug}`}
                            className="
                            block rounded-xl bg-white px-5 py-4 shadow-sm
                            border border-slate-200
                            hover:shadow-md hover:border-slate-300
                            transition-all duration-150

                            dark:bg-slate-900 dark:border-slate-700
                            dark:hover:border-slate-600 dark:hover:shadow-md
                        "
                        >
                            <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">
                                {note.meta.title || note.slug}
                            </h2>

                            {note.meta.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                    {note.meta.description}
                                </p>
                            )}

                            {note.meta.tags && note.meta.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {note.meta.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="
                                            inline-flex items-center rounded-full
                                            border border-emerald-100 bg-emerald-50
                                            text-emerald-700 px-2.5 py-0.5 text-xs font-medium

                                            dark:border-emerald-900/40 dark:bg-emerald-900/20
                                            dark:text-emerald-300
                                        "
                                        >
                                        {tag}
                                    </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

}
