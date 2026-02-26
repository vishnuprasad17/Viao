export interface DateRangeStrategy {
    getRange(): { start: Date; end: Date };
    getGroupBy(): GroupByExpression;
    getSortField(): string;
    getArrayLength(): number;
    formatResult(data: any[], arrayLength: number): number[];
}

export type GroupByExpression = 
    | { day: { $isoDayOfWeek: string } }
    | { month: { $month: string } }
    | { year: { $year: string } };