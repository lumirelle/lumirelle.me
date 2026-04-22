// oxlint-disable no-console
const now = performance.now()
for (let i = 0; i < 1000000; i++) {
  const UserStatus = {
    Inactive: 0,
    Active: 1,
    Banned: 2,
  }
  const UserStatusLabels = {
    [UserStatus.Inactive]: 'Inactive',
    [UserStatus.Active]: 'Active',
    [UserStatus.Banned]: 'Banned',
  }
  const UserStatusOptions = Object.entries(UserStatusLabels).map(([label, value]) => ({
    label,
    value,
  }))
  console.log(UserStatusOptions)
}
const end = performance.now()
console.log(`Execution time: ${end - now} ms`)
