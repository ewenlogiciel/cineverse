import { graphqlRequest } from './api'

export default {
  async getCategories(params = {}) {
    const query = `
      query {
        categories {
          edges {
            node {
              id
              name
              createdAt
            }
          }
        }
      }
    `
    const data = await graphqlRequest(query)
    return data.categories.edges.map(edge => {
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      return {
        id: idMatch ? idMatch[1] : edge.node.id,
        iriId: edge.node.id,
        name: edge.node.name,
        createdAt: edge.node.createdAt,
      }
    })
  },

  async getCategory(id) {
    const query = `
      query getCategory($id: ID!) {
        category(id: $id) {
          id
          name
          createdAt
        }
      }
    `
    const iriId = id.startsWith('/api/') ? id : `/api/categories/${id}`
    const data = await graphqlRequest(query, { id: iriId })
    const category = data.category
    const idMatch = category.id.match(/\/(\d+)$/)
    return {
      id: idMatch ? idMatch[1] : category.id,
      iriId: category.id,
      name: category.name,
      createdAt: category.createdAt,
    }
  },

  async createCategory(categoryData) {
    const mutation = `
      mutation createCategory($input: createCategoryInput!) {
        createCategory(input: $input) {
          category {
            id
            name
            createdAt
          }
        }
      }
    `;

    const variables = {
      input: {
        name: categoryData.name,
        createdAt: new Date().toISOString()
      }
    };

    const data = await graphqlRequest(mutation, variables);
    const category = data.createCategory.category;

    const idMatch = category.id.match(/\/(\d+)$/);
    return {
      id: idMatch ? idMatch[1] : category.id,
      iriId: category.id,
      name: category.name,
      createdAt: category.createdAt,
    };
  },

  async updateCategory(id, categoryData) {
    const mutation = `
      mutation updateCategory($input: updateCategoryInput!) {
        updateCategory(input: $input) {
          category {
            id
            name
          }
        }
      }
    `;

    const iriId = id.startsWith('/api/') ? id : `/api/categories/${id}`;

    const variables = {
      input: {
        id: iriId,
        name: categoryData.name
      }
    };

    const data = await graphqlRequest(mutation, variables);
    const category = data.updateCategory.category;

    const idMatch = category.id.match(/\/(\d+)$/);
    return {
      id: idMatch ? idMatch[1] : category.id,
      iriId: category.id,
      name: category.name
    };
  },

  async deleteCategory(id) {
    const mutation = `
      mutation deleteCategory($input: deleteCategoryInput!) {
        deleteCategory(input: $input) {
          category {
            id
          }
        }
      }
    `;

    const iriId = id.startsWith('/api/') ? id : `/api/categories/${id}`;

    const data = await graphqlRequest(mutation, {
      input: { id: iriId }
    });
    return data.deleteCategory;
  },
}