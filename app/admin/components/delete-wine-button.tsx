"use client";

type DeleteWineButtonProps = {
    wineName: string;
    action: () => void;
};

export default function DeleteWineButton({ wineName, action }: DeleteWineButtonProps) {
    return (
        <form action={action}>
            <button
                type="submit"
                className="font-sans text-sm text-red-700 underline-offset-2 hover:underline"
                onClick={(event) => {
                    if (!confirm(`Opravdu smazat „${wineName}"?`)) {
                        event.preventDefault();
                    }
                }}
            >
                Smazat
            </button>
        </form>
    );
}
