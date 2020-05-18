global.__dirname = __dirname
jest.mock('fs')
jest.mock('src/lib', () => {
  return {
    ...require.requireActual('src/lib'),
    generateTemplate: () => '',
  }
})

import fs from 'fs'

import 'src/lib/test'

import { files } from '../../../generate/cell/cell'
import { tasks } from '../cell'

beforeEach(() => {
  fs.__setMockFiles({
    ...files({ name: 'User' }),
  })
})

test('destroys cell files', async () => {
  const unlinkSpy = jest.spyOn(fs, 'unlinkSync')
  const t = tasks({ componentName: 'cell', filesFn: files, name: 'User' })
  t.setRenderer('silent')

  return t.run().then(() => {
    const generatedFiles = Object.keys(files({ name: 'User' }))
    expect(generatedFiles.length).toEqual(unlinkSpy.mock.calls.length)
    generatedFiles.forEach((f) => expect(unlinkSpy).toHaveBeenCalledWith(f))
  })
})
