import { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from 'dotenv';
dotenv.config()
const config: CodegenConfig = {
  schema: process.env.GRAPHQL_URL,
  documents: ['pages/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: []
    }
  }
}
 
export default config