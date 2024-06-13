import schedule from 'node-schedule'
import {Mission} from './types'
import {buildUUID} from '../uuid'

export default class NodeScheduleMission implements Mission.Mission {
	private static readonly MIN_INTERVAL = 5000
	private jobs: Map<string, any> = new Map()
	private time: Object = {}
	private key: any = ''

	constructor(key?: string) {
		this.key = key ?? buildUUID()
	}

	public schedules(missions: Mission.Config[]): Mission.Job[] {
		const executor = (job) => {
			let now = Date.now(),
				before = this.time[job.id] || 0
			if (now - before > NodeScheduleMission.MIN_INTERVAL) {
				job.execute()
				this.time[job.id] = now
			}
		}
		const jobs = Object.seal(
			missions
				.filter((e) => e.disabled !== true)
				.map((job) => {
					if (this.jobs.has(job.id)) {
						this.jobs.get(job.id)?.cancel()
						this.jobs.delete(job.id)
					}
					if (job.immediate) executor(job)
					if (job.trigger) {
						let j = schedule.scheduleJob(job.id, job.trigger, () => executor(job))
						this.jobs.set(job.id, j)
						return j
					}
				})
				.filter((job) => !!job)
		)
		return jobs
	}

	public uninstall(jobs: Mission.Job[]) {
		jobs.forEach((job) => {
			if (Reflect.has(job, 'id')) {
				let j = this.jobs.get(job?.id ?? job?.name)
				j?.cancel?.()
				this.jobs.delete(job?.id)
			} else {
				this.jobs.forEach((value, key, map) => {
					if (job == value) {
						job?.cancel?.()
						this.jobs.delete(key)
					}
				})
			}
			delete this.time[job.name]
		})
	}

	public dispose() {
		this.jobs.forEach((value, key) => {
			value?.cancel?.()
			this.jobs.delete(key)
		})
	}
}
