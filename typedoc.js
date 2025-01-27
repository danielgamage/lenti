
/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
export default {
  "plugin": [
    "typedoc-plugin-markdown",
    "typedoc-plugin-dt-links",
    "typedoc-plugin-mdn-links",
  ],
  "out": "./docs",
  "readme": "./src/README.md",
  "entryPoints": ["./src/index.ts"],
  "outputs": [
    {
      "name": "markdown",
      "path": "README.md"
    },
  ],
  "defaultCategory": "Lenti",
  "disableSources": true,
  "skipErrorChecking": true,
  "membersWithOwnFile": [],
  "flattenOutputFiles": true,
  "excludeReferences": true,
  "mergeReadme": true,
  "includeVersion": true,
  "includeHierarchySummary": true,

  // 	Do not print page header.
  "hidePageHeader": false,
  // 	Do not print breadcrumbs.
  "hideBreadcrumbs": false,
  // 	Do not print page title.
  "hidePageTitle": false,
  // 	Excludes grouping by kind so all members are rendered at the same level.
  "hideGroupHeadings": false,
  // 	Wraps signatures and declarations in code blocks.
  "useCodeBlocks": true,
  // 	Expand objects inside declarations.
  "expandObjects": true,
  // 	Expand parameters in signature parentheses to display type information.
  "expandParameters": true,
  // 	Specifies comment block tags that should preserve their position.
  "blockTagsPreserveOrder": [],
  // 	Sets the format of index items.
  "indexFormat": "table",
  // 	Sets the format of parameter and type parameter groups.
  "parametersFormat": "list",
  // 	Sets the format of property groups for interfaces.
  "interfacePropertiesFormat": "table",
  // 	Sets the format of property groups for classes.
  "classPropertiesFormat": "table",
  // 	Sets the format of enumeration members.
  "enumMembersFormat": "table",
  // 	Sets the format of style for property members for interfaces and classes.
  "propertyMembersFormat": "table",
  // 	Sets the format of style for type declaration members.
  "typeDeclarationFormat": "table",
  // 	Set the visibility level for type declaration documentation.
  "typeDeclarationVisibility": "verbose",
  // 	Control how table columns are configured and displayed.
  "tableColumnSettings": {},
}
