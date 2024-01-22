import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../layout/layout"
import SEO from "../layout/seo"
import ReleaseNoteTeaser from "../components/ReleaseNoteTeaser"
import ReleaseNoteCategorySelector from "../components/ReleaseNoteCategorySelector.js"
import { releaseNoteFragment } from "../fragments/releaseNote.js"

import { Container } from "@pantheon-systems/pds-toolkit-react"

// Set container width for search and main content.
const containerWidth = "standard"

const ReleaseNotesListingTemplate = ({ data }) => {
  const allReleasenotes = data.allMdx.edges
  const emptyQuery = ""

  // Set up state.
  const [filteredData, setFilteredData] = useState([])
  const [query, setQuery] = useState(emptyQuery)

  // Handle search input.
  const handleInputChange = (event) => {
    const query = event.target.value

    // const releasenotes = data.allMdx.edges || []

    // Filter releasenotes based on query.
    const filteredData = releasenotes.filter((releasenote) => {
      const { title } = releasenote.node.frontmatter
      return title.toLowerCase().includes(query.toLowerCase())
    })

    // Update state based on query.
    setFilteredData(filteredData)
    setQuery(query)
  }

  // If query is empty, show all releasenotes.
  const hasSearchResults = filteredData && query !== emptyQuery
  const releasenotes = hasSearchResults ? filteredData : allReleasenotes

  return (
    <Layout containerWidth={containerWidth} footerBorder>
      <SEO
        title="Pantheon Release Notes"
        description="A summary of changes to the Pantheon Platform"
        image={"assets/images/default-thumb-doc.png"}
      />
      <main id="docs-main" tabIndex="-1">
        <Container width={containerWidth}>
          <h1>Pantheon Release Notes</h1>
          <div className="pds-input-field__input-wrapper">
            <input
              type="text"
              aria-label="Search"
              placeholder="Search release notes"
              id="release-note-search"
              className="pds-input-field__input"
              onChange={handleInputChange}
            />
          </div>
          <ReleaseNoteCategorySelector />
          <div id="doc">
            {releasenotes.map((releasenote, index) => (
              <ReleaseNoteTeaser
                key={index}
                ReleaseNoteData={releasenote.node}
                className="pds-spacing-mar-block-5xl"
              />
            ))}
          </div>
        </Container>
      </main>
    </Layout>
  )
}

export default ReleaseNotesListingTemplate

export const pageQuery = graphql`
  query releasenotesListing {
    allMdx(
      filter: { fileAbsolutePath: { regex: "/releasenotes/" } }
      sort: { fields: [fileAbsolutePath], order: DESC }
    ) {
      edges {
        node {
          ... on Mdx {
            ...theReleaseNoteFields
          }
        }
      }
    }
  }
`