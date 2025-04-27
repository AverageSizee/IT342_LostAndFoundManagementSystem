package com.example.lostfoundmanagementsystem.ui.lostitems

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.lostfoundmanagementsystem.data.model.LostItem
import com.example.lostfoundmanagementsystem.databinding.ItemLostBinding

class LostItemAdapter(
    private val items: List<LostItem>,
    private val onItemClick: (LostItem) -> Unit
) : RecyclerView.Adapter<LostItemAdapter.LostItemViewHolder>() {

    inner class LostItemViewHolder(private val binding: ItemLostBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: LostItem) {
            binding.itemName.text = item.itemName
            binding.itemLocation.text = item.location

            Glide.with(binding.itemImage.context)
                .load(item.imageUrl)
                .placeholder(android.R.drawable.ic_menu_report_image)
                .error(android.R.drawable.ic_delete)
                .into(binding.itemImage)

            binding.root.setOnClickListener {
                onItemClick(item)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LostItemViewHolder {
        val binding = ItemLostBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LostItemViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LostItemViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount() = items.size
}