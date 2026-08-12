import {AuthService} from '@platform/auth/auth.service'
import {SupabaseClientService} from '@platform/supabase/supabase-client.service'
import {TrackingRepository} from './tracking.repository'

describe('TrackingRepository', () => {
  it('reads only the latest session before the selected date and sorts its sets', async () => {
    const data = {
      id: 20,
      id_user: 'test-user',
      exercise_id: 3,
      performed_on: '2026-07-29',
      sort_order: 0,
      created_at: '2026-07-29T00:00:00Z',
      updated_at: '2026-07-29T00:00:00Z',
      training_set: [
        {id: 32, id_user: 'test-user', entry_id: 20, position: 2, repetitions: 8, weight_kg: 42.5, created_at: '', updated_at: ''},
        {id: 31, id_user: 'test-user', entry_id: 20, position: 1, repetitions: 10, weight_kg: 40, created_at: '', updated_at: ''},
      ],
    }
    const builder = {
      select: jasmine.createSpy('select'),
      eq: jasmine.createSpy('eq'),
      lt: jasmine.createSpy('lt'),
      order: jasmine.createSpy('order'),
      limit: jasmine.createSpy('limit'),
      maybeSingle: jasmine.createSpy('maybeSingle').and.resolveTo({data, error: null}),
    }
    builder.select.and.returnValue(builder)
    builder.eq.and.returnValue(builder)
    builder.lt.and.returnValue(builder)
    builder.order.and.returnValue(builder)
    builder.limit.and.returnValue(builder)
    const supabase = {client: {from: jasmine.createSpy('from').and.returnValue(builder)}}
    const auth = {requireUserId: jasmine.createSpy('requireUserId').and.returnValue('test-user')}
    const repository = new TrackingRepository(
      supabase as unknown as SupabaseClientService,
      auth as unknown as AuthService,
    )

    const result = await repository.readPreviousByExercise(3, '2026-08-05')

    expect(builder.eq.calls.allArgs()).toEqual([['id_user', 'test-user'], ['exercise_id', 3]])
    expect(builder.lt).toHaveBeenCalledOnceWith('performed_on', '2026-08-05')
    expect(builder.order).toHaveBeenCalledOnceWith('performed_on', {ascending: false})
    expect(builder.limit).toHaveBeenCalledOnceWith(1)
    expect(result?.training_set.map(set => set.position)).toEqual([1, 2])
  })
})
