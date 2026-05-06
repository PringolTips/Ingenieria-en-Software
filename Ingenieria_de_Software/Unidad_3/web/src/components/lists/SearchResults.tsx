interface SearchResultsProps {
    resultados: any[];
}

export default function SearchResults({ resultados }: SearchResultsProps) {
    if (resultados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
                <p className="text-sm font-medium text-foreground">Sin resultados</p>
                <p className="text-xs text-muted-foreground">Intenta con otro nombre de usuario o correo.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Usuario</th>
                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Correo</th>
                        <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.map((usuario) => (
                        <tr
                            key={usuario.nombre_usuario}
                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                            <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-semibold text-primary uppercase">
                                            {usuario.nombre_usuario.slice(0, 2)}
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">{usuario.nombre_usuario}</span>
                                </div>
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground">{usuario.correo}</td>
                            <td className="px-5 py-3.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {usuario.nombre_rol}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}