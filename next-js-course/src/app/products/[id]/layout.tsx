export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
            <div>
                <h2>Featured Product Section</h2>
                <p className="text-sm">Here you can find details about the product.</p>
            </div>
        </div>

    );
}