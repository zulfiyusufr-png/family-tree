const params = new URLSearchParams(location.search);
const familyId = params.get("family");
let tree;

fetch("data/families.json")
  .then(r => r.json())
  .then(data => {
    const family = data.families.find(f => f.family_id === familyId);

    const nodes = family.members.map(m => ({
      id: m.id,
      pids: m.partners || [],
      fid: m.parentIds[0],
      mid: m.parentIds[1],
      name: m.name,
      birth: m.birth,
      death: m.death,
      bio: m.bio,
      img: m.photo
    }));

    tree = new FamilyTree(document.getElementById("tree"), {
      nodes,
      nodeBinding: {
        field_0: "name",
        img_0: "img"
      },
      nodeMouseClick: FamilyTree.action.details
    });
  });

document.getElementById("search").addEventListener("input", e => {
  tree.search(e.target.value);
});

function exportImage() {
  html2canvas(document.getElementById("tree")).then(canvas => {
    const link = document.createElement("a");
    link.download = "family-tree.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function exportPDF() {
  html2canvas(document.getElementById("tree")).then(canvas => {
    const pdf = new jspdf.jsPDF("landscape");
    pdf.addImage(canvas.toDataURL(), "PNG", 10, 10, 280, 150);
    pdf.save("family-tree.pdf");
  });
}
