const useSectionData = (items) => {
  const data = [];
  items.forEach(item => {
    data.push({
      sectionsLength: items.length,
      title: item,
      data: [item]
    });
  });

  return data;
}

export default useSectionData;
