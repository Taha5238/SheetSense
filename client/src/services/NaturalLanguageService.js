/* global Excel */

/**
 * Natural Language Service using Backend Proxy.
 * Sends requests to local server which handles Gemini communication.
 */

const NaturalLanguageService = {

    /**
     * Process a natural language command using Backend.
     */
    processCommand: async (command) => {
        try {
            // Get context (current selection)
            let contextInfo = "No selection info.";
            try {
                await Excel.run(async (context) => {
                    const range = context.workbook.getSelectedRange();
                    range.load("address");
                    const sheet = context.workbook.worksheets.getActiveWorksheet();
                    sheet.load("name");
                    await context.sync();
                    contextInfo = `Current Sheet: "${sheet.name}". Selected Range: "${range.address}"`;
                });
            } catch (e) {
                console.warn("Could not get Excel context (likely not in Excel):", e);
            }

            // Call Backend
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: command,
                    context: contextInfo
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            const parsed = await response.json();

            if (!parsed.actions || !Array.isArray(parsed.actions)) {
                return "No valid actions generated.";
            }

            // Execute Actions
            await NaturalLanguageService.executeActions(parsed.actions);

            return `Done! Executed ${parsed.actions.length} action(s).`;

        } catch (error) {
            console.error("Backend Error:", error);
            return `Error: ${error.message}`;
        }
    },

    /**
     * Execute the array of JSON actions in Excel.
     */
    executeActions: async (actions) => {
        console.log("Executing Actions:", actions);
        let errorMessages = [];

        await Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();

            // Get current selection address to use as default
            const selection = context.workbook.getSelectedRange();
            selection.load("address");
            await context.sync();
            const defaultAddress = selection.address;

            for (const action of actions) {
                try {
                    // Resolve address: Use provided or default to selection
                    const targetAddress = action.address || defaultAddress;
                    let targetRange = sheet.getRange(targetAddress);

                    switch (action.type) {
                        case 'editCell':
                            if (action.values) {
                                targetRange.values = action.values;
                            }
                            break;

                        case 'formatRange':
                            const f = action.format;
                            if (f.fill) targetRange.format.fill.color = f.fill;
                            if (f.fontColor) targetRange.format.font.color = f.fontColor;
                            if (f.bold !== undefined) targetRange.format.font.bold = f.bold;
                            if (f.italic !== undefined) targetRange.format.font.italic = f.italic;
                            if (f.fontSize) targetRange.format.font.size = f.fontSize;
                            if (f.numberFormat) targetRange.numberFormat = [[f.numberFormat]];
                            if (f.horizontalAlignment) targetRange.format.horizontalAlignment = f.horizontalAlignment;

                            if (f.columnWidth === 'AutoFit') targetRange.getEntireColumn().format.autofitColumns();
                            else if (typeof f.columnWidth === 'number') targetRange.columnWidth = f.columnWidth;
                            break;

                        case 'createTable':
                            // tables.add requires string address.
                            const table = sheet.tables.add(targetAddress, action.hasHeaders || true);
                            if (action.name) table.name = action.name;
                            break;

                        case 'createChart':
                            let chartType = Excel.ChartType.columnClustered;
                            if (action.type === 'Line') chartType = Excel.ChartType.line;
                            if (action.type === 'Pie') chartType = Excel.ChartType.pie;
                            if (action.type === 'BarClustered') chartType = Excel.ChartType.barClustered;

                            // Use provided dataRange or default selection
                            const dataRange = action.dataRange ? sheet.getRange(action.dataRange) : targetRange;

                            const chart = sheet.charts.add(chartType, dataRange, action.seriesBy === 'Rows' ? Excel.ChartSeriesBy.rows : Excel.ChartSeriesBy.columns);

                            if (action.title) chart.title.text = action.title;
                            break;

                        case 'addWorksheet':
                            context.workbook.worksheets.add(action.name);
                            break;

                        case 'freezePanes':
                            if (action.type === 'Row') sheet.freezePanes.freezeRows(action.count || 1);
                            if (action.type === 'Column') sheet.freezePanes.freezeColumns(action.count || 1);
                            break;
                    }
                } catch (innerError) {
                    console.warn(`Failed to execute action ${action.type}:`, innerError);
                    errorMessages.push(`${action.type}: ${innerError.message}`);
                }
            }
            await context.sync();
        });

        if (errorMessages.length > 0) {
            throw new Error(`Errors during execution: ${errorMessages.join(", ")}`);
        }
    }
};

export default NaturalLanguageService;
