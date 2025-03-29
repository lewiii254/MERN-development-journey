export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div>
            <h1>Product Details: {id} </h1>
            <p>This page will display details for a specific product.</p>
        </div>
    );
}