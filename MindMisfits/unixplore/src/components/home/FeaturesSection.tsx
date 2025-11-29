export function FeaturesSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-lg">Easy Discovery</h3>
                        <p className="text-muted-foreground">
                            Search colleges by ID or name and explore their clubs instantly
                        </p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-lg">No Login Required</h3>
                        <p className="text-muted-foreground">
                            Browse all content freely without creating an account
                        </p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-lg">Always Updated</h3>
                        <p className="text-muted-foreground">
                            Clubs post announcements and registrations in real-time
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
