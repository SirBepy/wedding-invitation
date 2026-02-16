export default function useUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const groupId = params.get('group') || null

  return { groupId }
}
