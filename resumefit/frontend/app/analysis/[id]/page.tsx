import { ResultsClient } from "@/components/ResultsClient";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <ResultsClient id={id} />;
}
